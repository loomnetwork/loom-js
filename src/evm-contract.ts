import EventEmitter from 'events'

import { Client, ClientEvent, IChainEventArgs } from './client'
import { CallTx, MessageTx, Transaction, VMType } from './proto/loom_pb'
import { Address } from './address'

/**
 * The EvmContract class streamlines interaction with a contract that was
 * deployed on a Loom DAppChain EVM.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API.
 */
export class EvmContract extends EventEmitter {
  static readonly EVENT = 'event'

  private _client: Client

  address: Address
  caller: Address

  /**
   * @param params Parameters.
   * @param params.contractAddr Address of a contract on the Loom DAppChain EVM.
   * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
   *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
   * @param params.client: Client to use to communicate with the contract.
   */
  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super()
    this._client = params.client
    this.address = params.contractAddr
    this.caller = params.callerAddr

    const emitContractEvent = this._emitContractEvent.bind(this)

    this.on('newListener', (event: string) => {
      if (event === EvmContract.EVENT && this.listenerCount(event) === 0) {
        this._client.on(ClientEvent.Contract, emitContractEvent)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === EvmContract.EVENT && this.listenerCount(event) === 0) {
        this._client.removeListener(ClientEvent.Contract, emitContractEvent)
      }
    })
  }

  /**
   * Calls a contract method that mutates state.
   * The call into the contract is accomplished by committing a tx to the DAppChain.
   * @param args ABI encoded function signature and input paramters.
   * @returns A promise that will be resolved with return value (if any) of the contract method.
   */
  async callAsync(args: number[], output?: Uint8Array): Promise<Uint8Array | void> {
    const ui8InData = Uint8Array.from(args)
    const callTx = new CallTx()
    callTx.setVmType(VMType.EVM)
    callTx.setInput(ui8InData)

    const msgTx = new MessageTx()
    msgTx.setFrom(this.caller.MarshalPB())
    msgTx.setTo(this.address.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())

    return this._client.commitTxAsync<Transaction>(tx)
  }
  /**
   * Calls a method of a contract running on an EVM that doesn't mutate state.
   * This method is usually used to query the current contract state, it doesn't commit any txs.
   * @param args ABI encoded function signature and input paramters.
   * @returns A promise that will be resolved with the return value of the contract method.
   */
  async staticCallAsync(args: number[], output?: Uint8Array): Promise<Uint8Array | void> {
    const ui8InData = Uint8Array.from(args)
    return this._client.queryAsync(this.address, ui8InData, VMType.EVM, this.caller)
  }

  private _emitContractEvent(event: IChainEventArgs) {
    if (event.contractAddress.equals(this.address)) {
      this.emit(EvmContract.EVENT, event)
    }
  }
}
