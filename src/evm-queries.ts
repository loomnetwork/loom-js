import debug from 'debug'
import {
  EvmTxReceipt,
  EvmTxObject,
  EthBlockInfo,
  EthFilterEnvelope,
  EthBlockHashList,
  EthFilterLogList,
  EthTxHashList
} from './proto/evm_pb'
import { Uint8ArrayToB64, B64ToUint8Array, bufferToProtobufBytes } from './crypto-utils'
import { IJSONRPCClient } from './internal/json-rpc-client'
import { Address } from './address'

const debugLog = debug('evm-client')

export class EvmQueries {
  private _readClient: IJSONRPCClient

  constructor(readClient: IJSONRPCClient) {
    this._readClient = readClient
  }

  /**
   * Queries the receipt corresponding to a transaction hash
   *
   * @param txHash Transaction hash returned by call transaction.
   * @return EvmTxReceipt The corresponding transaction receipt.
   */
  async getEvmTxReceiptAsync(txHash: Uint8Array): Promise<EvmTxReceipt | null> {
    const result = await this._readClient.sendAsync<string>('evmtxreceipt', {
      txHash: Uint8ArrayToB64(txHash)
    })
    if (result) {
      return EvmTxReceipt.deserializeBinary(bufferToProtobufBytes(B64ToUint8Array(result)))
    } else {
      return null
    }
  }

  /**
   * Returns the information about a transaction requested by transaction hash
   *
   * @param txHash Transaction hash returned by call transaction.
   * @return EvmTxObject The corresponding transaction object data.
   */
  async getEvmTxByHashAsync(txHash: Uint8Array): Promise<EvmTxObject | null> {
    const result = await this._readClient.sendAsync<string>('getevmtransactionbyhash', {
      txHash: Uint8ArrayToB64(txHash)
    })
    if (result) {
      return EvmTxObject.deserializeBinary(bufferToProtobufBytes(B64ToUint8Array(result)))
    } else {
      return null
    }
  }

  /**
   * Queries the code corresponding to a contract
   *
   * @param contractAddress Contract address returned by deploy.
   * @return Uint8Array The corresponding contract code
   */
  async getEvmCodeAsync(contractAddress: Address): Promise<Uint8Array | null> {
    const result = await this._readClient.sendAsync<string>('getevmcode', {
      contract: contractAddress.toString()
    })
    if (result) {
      return B64ToUint8Array(result)
    } else {
      return null
    }
  }

  /**
   * Queries logs with filter terms
   *
   * @param filter Filter terms
   * @return Uint8Array The corresponding result of the filter
   */
  async getEvmLogsAsync(filterObject: Object): Promise<Uint8Array | null> {
    const filter = JSON.stringify(filterObject)
    debugLog(`Send filter ${filter} to getlogs`)
    const result = await this._readClient.sendAsync<string>('getevmlogs', {
      filter
    })
    if (result) {
      return B64ToUint8Array(result)
    } else {
      return null
    }
  }

  /**
   * Creates a new filter based on filter terms, to notify when the state changes
   *
   * The function getEVMNewFilterAsync works in the similar way of the RPC call eth_newFilter, for more
   *
   * Also for understand how filters works check https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
   *
   * @param filter Filter terms
   * @return Uint8Array The corresponding result of the filter
   */
  async newEvmFilterAsync(filterObject: Object): Promise<string | null> {
    const filter = JSON.stringify(filterObject)
    debugLog(`Send filter ${filter} to newfilter`)
    const result = await this._readClient.sendAsync<string>('newevmfilter', {
      filter
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  /**
   * Polling method for a filter, which returns an array of logs which occurred since last poll
   *
   * The ID used was requested from getEVMNewFilterChanges or getEVMNewBlockFilter
   *
   * @param id Id of filter previously created
   * @return Uint8Array The corresponding result of the request for given id
   */
  async getEvmFilterChangesAsync(
    id: string
  ): Promise<EthBlockHashList | EthFilterLogList | EthTxHashList | null> {
    debugLog(`Get filter changes for ${JSON.stringify({ id }, null, 2)}`)
    const result = await this._readClient.sendAsync<Uint8Array>('getevmfilterchanges', {
      id
    })

    if (result) {
      const envelope: EthFilterEnvelope = EthFilterEnvelope.deserializeBinary(
        bufferToProtobufBytes(result)
      )

      switch (envelope.getMessageCase()) {
        case EthFilterEnvelope.MessageCase.ETH_BLOCK_HASH_LIST:
          return envelope.getEthBlockHashList() as EthBlockHashList
        case EthFilterEnvelope.MessageCase.ETH_FILTER_LOG_LIST:
          return envelope.getEthFilterLogList() as EthFilterLogList
        case EthFilterEnvelope.MessageCase.ETH_TX_HASH_LIST:
          return envelope.getEthTxHashList() as EthTxHashList
        case EthFilterEnvelope.MessageCase.MESSAGE_NOT_SET:
        default:
          return null
      }
    } else {
      return null
    }
  }

  /**
   * Creates a filter in the node, to notify when a new block arrives
   *
   * In order to check if the state has changed, call getEVMFilterChangesAsync
   *
   * @return String Filter ID in hex format to be used later with getEVMFilterChangesAsync
   */
  async newBlockEvmFilterAsync(): Promise<string | null> {
    const result = await this._readClient.sendAsync<string>('newblockevmfilter', {})
    if (result) {
      return result.toString()
    } else {
      return null
    }
  }

  /**
   * Creates a filter in the node, to notify when new pending transactions arrive.
   *
   * In order to check if the state has changed, call getEVMFilterChangesAsync
   *
   * @return String Filter ID in hex format to be used later with getEVMFilterChangesAsync
   */
  async newEvmPendingTransactionEvmFilterAsync(): Promise<string | null> {
    const result = await this._readClient.sendAsync<string>('newpendingtransactionevmfilter', {})
    if (result) {
      return result.toString()
    } else {
      return null
    }
  }

  /**
   * Uninstall/delete previously created filters
   *
   * The ID used was requested from getEVMNewFilterChanges or getEVMNewBlockFilter
   *
   * @param id Id of filter previously created
   * @return boolean If true the filter is removed with success
   */
  uninstallEvmFilterAsync(id: string): Promise<boolean | null> {
    return this._readClient.sendAsync<boolean>('uninstallevmfilter', {
      id
    })
  }

  /**
   * Returns information about a block by block number.
   *
   * @param num Integer of a block number
   * @param full If true it returns the full transaction objects, if false only the hashes of the transactions
   */
  async getEvmBlockByNumberAsync(num: string, full: boolean = true): Promise<EthBlockInfo | null> {
    const result = await this._readClient.sendAsync<string>('getevmblockbynumber', {
      number: num,
      full
    })
    if (result) {
      return EthBlockInfo.deserializeBinary(bufferToProtobufBytes(B64ToUint8Array(result)))
    } else {
      return null
    }
  }

  /**
   * Returns the information about a transaction requested by transaction hash.
   *
   * @param hash String with the hash of the transaction
   * @param full If true it returns the full transaction objects, if false only the hashes of the transactions
   */
  async getEvmBlockByHashAsync(
    hashHexStr: string,
    full: boolean = true
  ): Promise<EthBlockInfo | null> {
    const result = await this._readClient.sendAsync<string>('getevmblockbyhash', {
      hash: Buffer.from(hashHexStr.slice(2), 'hex').toString('base64'),
      full
    })
    if (result) {
      return EthBlockInfo.deserializeBinary(bufferToProtobufBytes(B64ToUint8Array(result)))
    } else {
      return null
    }
  }

  /**
   * It works by subscribing to particular events. The node will return a subscription id.
   * For each event that matches the subscription a notification with relevant data is send
   * together with the subscription id.
   *
   * Possible methods:
   *  * "NewHeads": Fires a notification each time a new header is appended to the chain
   *  * "Logs": Returns logs that are included in new imported blocks and match the given filter criteria
   *
   * Example of a "filter" (JSON String) with method "logs":
   *  {
   *    "address": "0xa520fe7702b96808f7bbc0d4a233ed1468216cfd",
   *    "topics": ["0x238a0cb8bb633d06981248b822e7bd33c2a35a6089241d099fa519e361cab902"]
   *  }
   *
   * @param method Method selected to the filter, can be "newHeads" or "logs"
   * @param filter JSON string of the filter
   */
  evmSubscribeAsync(method: string, filterObject: Object): Promise<string> {
    const filter = JSON.stringify(filterObject)
    return this._readClient.sendAsync<string>('evmsubscribe', {
      method,
      filter
    })
  }

  /**
   * Subscriptions are cancelled method and the subscription id as first parameter.
   * It returns a bool indicating if the subscription was cancelled successful.
   *
   * @param id Id of subscription previously created
   * @return boolean If true the subscription is removed with success
   */
  evmUnsubscribeAsync(id: string): Promise<boolean> {
    return this._readClient.sendAsync<boolean>('evmunsubscribe', {
      id
    })
  }
}
