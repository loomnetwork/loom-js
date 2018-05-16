import { Message } from 'google-protobuf'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

import { Client } from './client'
import { MessageTx, Transaction, CallTx, VMType, Response } from './proto/loom_pb'
import { Address } from './address'
import { bufferToProtobufBytes } from './crypto-utils'

/**
 * The EvmContract class streamlines interaction with a contract that was
 * deployed on a Loom DAppChain EVM.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 */
export class EvmContract {
  private _client: Client

  address: Address
  caller: Address

  /**
   * @param params Parameters.
   * @param params.contractAddr Address of a contract on the Loom DAppChain EVM.
   * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
   *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
   * @param params.client: Client to use to communicate with the contract.
   * @param params.vmType: Which virtual machine to use. Plugin or Evm.
   */
  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    this._client = params.client
    this.address = params.contractAddr
    this.caller = params.callerAddr
  }

  /**
   * Calls a contract method that mutates state.
   * The call into the contract is accomplished by committing a tx to the DAppChain.
   * @param args ABI encoded function signature and input paramters.
   * @returns A promise that will be resolved with return value (if any) of the contract method.
   */
  async callAsync<T extends Message | void>(args: Message, output?: T): Promise<T | void> {
    const callTx = new CallTx()
    callTx.setVmType(VMType.PLUGIN)
    callTx.setInput(args.serializeBinary())

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
}
