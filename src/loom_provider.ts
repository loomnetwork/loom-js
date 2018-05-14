import { Contract } from './contract'
import { EthCall, EthTransaction } from './proto/web3_pb'

/**
 * The provider manages the web3 calls to a endpoint, however the LoomProvider
 * wraps the web3 call which intent to be sent to an Ethereum node and turn it
 * into a Loom call for a Loom Contract
 */
export class LoomProvider {

  /**
   * @param contract: The contract which wraps an ethereum EVM
   */
  constructor(protected contract : Contract) {}

  _callAsync(data : any) : Promise<any> {
    const ethTransaction = new EthTransaction()
    ethTransaction.setData(data)
    return this.contract.callAsync('EthTransaction', ethTransaction)
  }

  _callStaticAsync(data : any) : Promise<any> {
    const ethCall = new EthCall()
    ethCall.setData(data)
    return this.contract.staticCallAsync<EthCall>('EthCall', ethCall, new EthCall())
  }

  /**
   * Should be used to make async request
   * This method is used internally by web3, so we adapt it to be used with loom contract
   * when we are wrapping the evm on a DAppChain
   * @param payload JSON payload generated by web3 which will be translated to loom transaction/call
   * @param callback Triggered on end with (err, result)
   */
  send(payload : any, callback : Function) {
    // Basic response to web3js
    const okResponse = {"id": 0,"jsonrpc":"2.0","result": 0}

    // Methods frequently called by web3js
    const okMethods = ['eth_estimateGas', 'eth_gasPrice']

    /**
     * NOTE: okResponse and OkMethods, are mocks only to allow web3js think that is talking
     * with a Ethereum Node
     */

    let ret = null

    // Ok just avoids web3js issues
    if (okMethods.indexOf(payload.method) !== -1) {
      ret = okResponse
    }

    // Sending transaction to Loom DAppChain
    else if (payload.method === 'eth_sendTransaction') {
      this._callAsync(payload.params[0].data)
      ret = okResponse
    }

    // Sending a static call to Loom DAppChain
    else if (payload.method === 'eth_call') {
      return this._callStaticAsync(payload.params[0].data)
        .then((result : any) => callback(null, result))
        .catch((err : Error) => callback(err, null))
    }

    // Required to avoid web3js error, because web3js always want to know about a transaction
    else if (payload.method === 'eth_getTransactionReceipt') {
      ret = {
        "id": 0,
        "jsonrpc":"2.0",
        "result": {
          "transactionHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "transactionIndex": "0x00",
          "blockHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "blockNumber": "0x00",
          "gasUsed": "0x0",
          "cumulativeGasUsed": "0x0",
          "contractAddress": null,
          "logs": [],
          "status": "0x01",
        }
      }
    }

    // Warn the user about we don't care about other methods
    else {
      return callback(Error(`Method "${payload.method}" not supported on this provider`), null)
    }

    callback(null, ret)
  }
}