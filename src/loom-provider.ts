import { Client } from './client'
import { CallTx, MessageTx, Transaction, VMType } from './proto/loom_pb'
import { Address, LocalAddress } from './address'


/**
 * The provider manages the web3 calls to a endpoint, however the LoomProvider
 * wraps the web3 call which intent to be sent to an Ethereum node and turn it
 * into a Loom call for a Loom Contract
 */
export class LoomProvider {
  // Satisfy the provider requirement
  public responseCallbacks: any = null
  public notificationCallbacks: any = null
  public connection: any = null
  public addDefaultEvents: any = null
  public on: any = null
  public removeListener: any = null
  public removeAllListeners: any = null
  public reset: any = null

  private _client: Client

  /**
   * @param client: The client which calls Ethereum EVM
   */
  constructor(client: Client) {
    this._client = client
  }

  /**
   * Should be used to make async request
   * This method is used internally by web3, so we adapt it to be used with loom contract
   * when we are wrapping the evm on a DAppChain
   * @param payload JSON payload generated by web3 which will be translated to loom transaction/call
   * @param callback Triggered on end with (err, result)
   */
  send(payload: any, callback: Function) {
    // Methods frequently called by web3js added just to follow the web3 requirements
    const okMethods = ['eth_estimateGas', 'eth_gasPrice']

    /**
     * NOTE: _okResponse and okMethods array are mocks, only to allow web3js think that is talking
     * to an Ethereum Node
     */

    let ret = null

    // Ok just avoids web3js issues
    if (okMethods.indexOf(payload.method) !== -1) {
      ret = this._okResponse()
    }

    // Sending transaction to Loom DAppChain
    else if (payload.method === 'eth_sendTransaction') {
      this._callAsync(payload.params[0])
        .then((result: any) => callback(null, this._okResponse()))
        .catch((err: Error) => callback(err, null))
    }

    // Sending a static call to Loom DAppChain
    else if (payload.method === 'eth_call') {
      this._callStaticAsync(payload.params[0])
        .then((result: any) => callback(null, this._okResponse(this._Uint8ArrayToHexString(result))))
        .catch((err: Error) => callback(err, null))
    }

    // Required to avoid web3js error, because web3js always want to know about a transaction
    else if (payload.method === 'eth_getTransactionReceipt') {
      // TODO: Wrap this correctly to return real status of transaction
      ret = {
        id: 0,
        jsonrpc: '2.0',
        result: {
          transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          transactionIndex: '0x00',
          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          blockNumber: '0x00',
          gasUsed: '0x0',
          cumulativeGasUsed: '0x0',
          contractAddress: null,
          logs: [],
          status: '0x01'
        }
      }
    }

    // Warn the user about we don't support other methods
    else {
      return callback(Error(`Method "${payload.method}" not supported on this provider`), null)
    }

    if (ret) callback(null, ret)
  }

  protected _callAsync(payload: any): Promise<any> {
    const caller = new Address(this._client.chainId, LocalAddress.fromHexString(payload.from))
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const ui8InData = this._hexStringToUint8Array(payload.data.substring(2))

    const callTx = new CallTx()
    callTx.setVmType(VMType.EVM)
    callTx.setInput(ui8InData)

    const msgTx = new MessageTx()
    msgTx.setFrom(caller.MarshalPB())
    msgTx.setTo(address.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())

    return this._client.commitTxAsync<Transaction>(tx)
  }

  protected _callStaticAsync(payload: any): Promise<any> {
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const ui8InData = this._hexStringToUint8Array(payload.data.substring(2))
    return this._client.queryAsync(address, ui8InData, VMType.EVM)
  }

  protected _hexStringToUint8Array(hexInput:string): Uint8Array {
    const bytes = new Uint8Array(Math.ceil(hexInput.length / 2))
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hexInput.substr(i * 2, 2), 16)
    }
    return bytes
  }

  protected _Uint8ArrayToHexString(data: Uint16Array): string {
    return '0x' + Array.prototype.map.call(data, (x: any) => ('00' + x.toString(16)).slice(-2)).join('');
  }

  // Basic response to web3js
  protected _okResponse(result: any = 0): any {
    return { id: 0, jsonrpc: '2.0', result }
  }
}
