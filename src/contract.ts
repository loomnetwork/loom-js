import { Client } from './client'
import {
  EncodingType,
  Address,
  ContractMethodCall,
  Request,
  MessageTx,
  Transaction,
  CallTx,
  VMType
} from './proto/loom_pb'
import { Message } from 'google-protobuf'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

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

const utf8Encoder = new TextEncoder()

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
   * @returns A promise that will be resolved with tx commit metadata.
   */
  async Call<T extends Message, U>(method: string, args: T): Promise<U> {
    const methodTx = new ContractMethodCall()
    methodTx.setMethod(method)
    methodTx.setArgs(utf8Encoder.encode(JSON.stringify(args)))

    const request = new Request()
    request.setContentType(EncodingType.PROTOBUF3)
    request.setBody(methodTx.serializeBinary())

    const callTx = new CallTx()
    callTx.setVmType(VMType.PLUGIN), callTx.setInput(request.serializeBinary())

    const msgTx = new MessageTx()
    msgTx.setFrom(this.caller)
    msgTx.setTo(this.address)
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())
    return await this._client.CommitTx<Transaction, U>(tx)
  }

  /**
   * Calls a contract method that doesn't mutate state.
   * @param method Contract method to call.
   * @param args Arguments to pass to the contract method.
   * @returns A promise that will be resolved with the return value of the contract method.
   */
  async StaticCall<T, U>(method: string, args: T): Promise<U> {
    const query = new ContractMethodCall()
    query.setMethod(method)
    query.setArgs(utf8Encoder.encode(JSON.stringify(args)))
    return await this._client.Query<U>(this.address, query)
  }
}
