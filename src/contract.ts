import { Message } from 'google-protobuf'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

import { Client } from './client'
import {
  EncodingType,
  ContractMethodCall,
  Request,
  MessageTx,
  Transaction,
  CallTx,
  VMType
} from './proto/loom_pb'
import { Address } from './address'
import { bufferToProtobufBytes } from './crypto-utils'

export interface ContractConstructorParams {
  // Address of a contract on the Loom DAppChain.
  contractAddr: Address
  // Name of the contract.
  contractName: string
  // Address of the caller.
  callerAddr: Address
  // Client to use to call the contract.
  client: Client
}

/**
 * Thin abstraction over Client that makes easier to call/query a specific contract running on a
 * Loom DAppChain.
 */
export class Contract {
  private _client: Client

  name: string
  address: Address
  caller: Address

  constructor(params: ContractConstructorParams) {
    this._client = params.client
    this.name = params.contractName
    this.address = params.contractAddr
    this.caller = params.callerAddr
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
    methodTx.setMethod(`${this.name}.${method}`)
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
      const msgClass = (<any>output).constructor as typeof Message
      Message.copyInto(
        msgClass.deserializeBinary(bufferToProtobufBytes(result)),
        output as Message
      )
    }
    return output
  }

  /**
   * Calls a contract method that doesn't mutate state.
   * @param method Contract method to call.
   * @param args Arguments to pass to the contract method.
   * @returns A promise that will be resolved with the return value of the contract method.
   */
  async staticCallAsync<T extends Message>(method: string, args: Message, output: T): Promise<T> {
    const query = new ContractMethodCall()
    query.setMethod(`${this.name}.${method}`)
    query.setArgs(args.serializeBinary())
    const result = await this._client.queryAsync(this.address, query)
    if (result && output) {
      const msgClass = (<any>output).constructor as typeof Message
      Message.copyInto(msgClass.deserializeBinary(bufferToProtobufBytes(result)), output)
    }
    return output
  }
}
