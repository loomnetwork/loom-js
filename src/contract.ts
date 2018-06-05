import { Message } from 'google-protobuf'
import EventEmitter from 'events'

import { Client, ClientEvent, IChainEventArgs } from './client'
import {
  CallTx,
  ContractMethodCall,
  EncodingType,
  MessageTx,
  Request,
  Response,
  Transaction,
  VMType
} from './proto/loom_pb'
import { Address } from './address'
import { bufferToProtobufBytes } from './crypto-utils'

/**
 * The Contract class streamlines interaction with a contract that was deployed on a Loom DAppChain.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(contract: Contract) {
 *   contract.on(Contract.EVENT, (event: IChainEventArgs) => {
 *     const dataStr = Buffer.from(event.data as Buffer).toString('utf8')
 *     const dataObj = JSON.parse(dataStr)
 *     console.log('Contract Event: ' + dataStr)
 *   })
 * }
 */
export class Contract extends EventEmitter {
  static readonly EVENT = 'event'

  private _client: Client

  name?: string
  address: Address
  caller: Address

  /**
   * @param params Parameters.
   * @param params.contractAddr Address of a contract on the Loom DAppChain.
   * @param params.contractName Name of the contract.
   * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
   *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
   * @param params.client: Client to use to communicate with the contract.
   */
  constructor(params: {
    contractAddr: Address
    contractName?: string
    callerAddr: Address
    client: Client
  }) {
    super()
    this._client = params.client
    this.name = params.contractName
    this.address = params.contractAddr
    this.caller = params.callerAddr

    const emitContractEvent = this._emitContractEvent.bind(this)

    this.on('newListener', (event: string) => {
      if (event === Contract.EVENT && this.listenerCount(event) === 0) {
        this._client.on(ClientEvent.Contract, emitContractEvent)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === Contract.EVENT && this.listenerCount(event) === 0) {
        this._client.removeListener(ClientEvent.Contract, emitContractEvent)
      }
    })
  }

  /**
   * Calls a contract method that mutates state.
   * The call into the contract is accomplished by committing a tx to the DAppChain.
   * @param method Contract method to call.
   * @param args Arguments to pass to the contract method.
   * @returns A promise that will be resolved with return value (if any) of the contract method.
   */
  async callAsync<T extends Message | void>(
    method: string,
    args: Message,
    output?: T
  ): Promise<T | void> {
    const methodTx = new ContractMethodCall()
    methodTx.setMethod(method)
    methodTx.setArgs(args.serializeBinary())

    const request = new Request()
    request.setContentType(EncodingType.PROTOBUF3)
    request.setAccept(EncodingType.PROTOBUF3)
    request.setBody(methodTx.serializeBinary())

    const callTx = new CallTx()
    callTx.setVmType(VMType.PLUGIN)
    callTx.setInput(request.serializeBinary())

    const msgTx = new MessageTx()
    msgTx.setFrom(this.caller.MarshalPB())
    msgTx.setTo(this.address.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())

    const result = await this._client.commitTxAsync<Transaction>(tx)
    if (result && output) {
      const resp = Response.deserializeBinary(bufferToProtobufBytes(result))
      const msgClass = (<any>output).constructor as typeof Message
      Message.copyInto(msgClass.deserializeBinary(resp.getBody_asU8()), output as Message)
    }
    return output
  }

  /**
   * Calls a contract method that doesn't mutate state.
   * This method is usually used to query the current contract state, it doesn't commit any txs.
   * @param method Contract method to call.
   * @param args Arguments to pass to the contract method.
   * @returns A promise that will be resolved with the return value of the contract method.
   */
  async staticCallAsync<T extends Message>(method: string, args: Message, output: T): Promise<T> {
    const query = new ContractMethodCall()
    query.setMethod(method)
    query.setArgs(args.serializeBinary())
    const result = await this._client.queryAsync(
      this.address,
      query.serializeBinary(),
      VMType.PLUGIN,
      this.caller
    )
    if (result && output) {
      const msgClass = (<any>output).constructor as typeof Message
      Message.copyInto(msgClass.deserializeBinary(bufferToProtobufBytes(result)), output)
    }
    return output
  }

  private _emitContractEvent(event: IChainEventArgs) {
    if (event.contractAddress.equals(this.address)) {
      this.emit(Contract.EVENT, event)
    }
  }
}
