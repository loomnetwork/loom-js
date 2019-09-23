import debug from 'debug'
import { Message } from 'google-protobuf'
import EventEmitter from 'events'
import retry from 'retry'

import { VMType } from './proto/loom_pb'
import {
  EvmTxReceipt,
  EvmTxObject,
  EthBlockInfo,
  EthFilterEnvelope,
  EthBlockHashList,
  EthFilterLogList,
  EthTxHashList
} from './proto/evm_pb'
import {
  Uint8ArrayToB64,
  B64ToUint8Array,
  bufferToProtobufBytes,
  hexToBytes
} from './crypto-utils'
import { Address, LocalAddress } from './address'
import { WSRPCClient, IJSONRPCEvent } from './internal/ws-rpc-client'
import { RPCClientEvent, IJSONRPCClient } from './internal/json-rpc-client'
import { sleep } from './helpers'

export interface ITxHandlerResult {
  code?: number
  log?: string // error message if code != 0
  data?: string
}

interface IBroadcastTxCommitResult {
  check_tx: ITxHandlerResult
  deliver_tx: ITxHandlerResult
  hash: string
  height?: string // int64
}

// Result of querying for a tx
interface ITxQueryResult {
  hash: string
  height: string
  index: string
  tx_result: ITxHandlerResult
  tx: string
}

export interface ITxBroadcastResult extends ITxHandlerResult {
  hash: string
}

export interface ITxResults {
  // Result of processing tx before it's included in a block (CheckTx)
  validation: ITxHandlerResult
  // Result of processing tx after it's included in a block (DeliverTx)
  commit: ITxHandlerResult
}

const debugLog = debug('client')

/**
 * Middleware handlers are expected to transform the tx data and check tx results.
 * Handlers should not modify the original input data in any way.
 */
export interface ITxMiddlewareHandler {
  // Transforms and returns tx data.
  Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>
  // Handles an error that occured when the tx was broadcast to the chain.
  handleError?(err: any): void
  // Checks the tx results and throws an error if needed.
  HandleResults?(results: ITxResults): ITxResults
}

export enum ClientEvent {
  /**
   * Emitted when an event is received from a smart contract.
   * Listener will receive IChainEventArgs.
   */
  Contract = 'contractEvent',
  /**
   * Exclusively used by loom-provider
   */
  EVMEvent = 'evmEvent',
  /**
   * Emitted when an error occurs that can't be relayed by other means.
   * Listener will receive IClientErrorEventArgs.
   */
  Error = 'error',
  /**
   * Emitted when a connection is established to the DAppChain.
   * Listener will receive INetEventArgs.
   */
  Connected = 'connected',
  /**
   * Emitted when a connection with the DAppChain is closed.
   * Listener will receive INetEventArgs.
   */
  Disconnected = 'disconnected'
}

export interface IClientEventArgs {
  kind: ClientEvent
  /** URL that corresponds to the RPC client this event originated from. */
  url: string
}

/**
 * Event that's emitted when some kind of error occurs that can't be relayed by other means,
 * e.g. socket error that occurs while listening for RPC events.
 */
export interface IClientErrorEventArgs extends IClientEventArgs {
  kind: ClientEvent.Error
  /** May contain additional information in case of an RPC error. */
  error?: any // could be IJSONRPCError, or something else
}

/** Generic event containing data emitted by smart contracts. */
export interface IChainEventArgs extends IClientEventArgs {
  /** Identifier (currently only used by EVM events). */
  id: string
  kind: ClientEvent.Contract | ClientEvent.EVMEvent
  /** Address of the contract that emitted the event. */
  contractAddress: Address
  /** Address of the caller that caused the event to be emitted. */
  callerAddress: Address
  /** The block containing the tx that caused this event to be emitted. */
  blockHeight: string
  /**
   * Data that was actually emitted by the smart contract,
   * the format and structure is defined by that contract.
   */
  data: Uint8Array
  /** Hash that identifies the uniqueness of the transaction */
  transactionHash: string
  /** Same as transactionHash in bytes */
  transactionHashBytes: Uint8Array
  /** Topics subscribed on events */
  topics: Array<string>
}

export const TX_ALREADY_EXISTS_ERROR = 'Tx already exists in cache'

export function isTxAlreadyInCacheError(err: any): boolean {
  // TODO: Need to update the WS client to throw the same errors as the HTTP client, so don't
  //       have to detect two different errors everywhere.
  return (
    (err instanceof Error && err.message.indexOf(TX_ALREADY_EXISTS_ERROR) !== -1) || // HTTP
    (err.data && err.data.indexOf(TX_ALREADY_EXISTS_ERROR) !== -1) // WS
  )
}

export interface ITxBroadcaster {
  broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult>
}

export class TxCommitBroadcaster implements ITxBroadcaster {
  broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult> {
    return client.sendAsync<IBroadcastTxCommitResult>('broadcast_tx_commit', [
      Uint8ArrayToB64(txBytes)
    ])
  }
}

export class TxSyncBroadcaster implements ITxBroadcaster {
  resultPollingStrategy: retry.OperationOptions = {
    retries: 5,
    minTimeout: 3000, // 3s
    maxTimeout: 5000, // 5s
    randomize: true
  }

  async broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult> {
    const checkTxResult = await client.sendAsync<ITxBroadcastResult>('broadcast_tx_sync', [
      Uint8ArrayToB64(txBytes)
    ])

    const { code, log, data } = checkTxResult
    // if the tx failed in CheckTx it won't make it into a block, and won't be indexed
    if (code !== 0) {
      return {
        check_tx: { code, log, data },
        deliver_tx: {},
        hash: checkTxResult.hash
      }
    }

    await sleep(this.resultPollingStrategy.minTimeout)

    const op = retry.operation(this.resultPollingStrategy)
    const result = await new Promise<ITxQueryResult>((resolve, reject) => {
      op.attempt((currentAttempt: number) => {
        debugLog(`Querying for result of tx ${checkTxResult.hash} - attempt ${currentAttempt}`)
        client
          .sendAsync<ITxQueryResult>('tx', {
            hash: Buffer.from(checkTxResult.hash, 'hex').toString('base64')
          })
          .then(result => resolve(result))
          .catch(err => {
            debugLog(
              `Failed to retrieve result of tx ${checkTxResult.hash}: ${err.message || err.data}`
            )
            // keep trying to retrieve the result if the tx isn't found, until all retries are used up
            if (
              (err instanceof Error && err.message.endsWith('not found')) || // HTTP
              (err.data && err.data.endsWith('not found')) // WS
            ) {
              if (!op.retry(err)) {
                reject(err)
              }
            } else {
              reject(err)
            }
          })
      })
    })

    return {
      check_tx: { code, log, data },
      deliver_tx: result.tx_result,
      hash: result.hash,
      height: result.height
    }
  }
}

/**
 * Writes to & reads from a Loom DAppChain.
 *
 * The client can listen to events emitted by smart contracts running on a DAppChain,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(client: Client) {
 *   client.on(ClientEvent.Contract, (event: IChainEventArgs) => {
 *     // handle event
 *   }
 * }
 */
export class Client extends EventEmitter {
  readonly chainId: string

  private _writeClient: IJSONRPCClient
  private _readClient!: IJSONRPCClient

  /** Broadcaster to use to send txs & receive results. */
  txBroadcaster: ITxBroadcaster

  /** Middleware to apply to transactions before they are transmitted to the DAppChain. */
  txMiddleware: ITxMiddlewareHandler[] = []

  get readUrl(): string {
    return this._readClient.url
  }

  get writeUrl(): string {
    return this._writeClient.url
  }

  /**
   * Constructs a new client to read & write data from/to a Loom DAppChain via web sockets.
   * @param chainId DAppChain identifier.
   * @param writeUrl Host & port to send txs, specified as "<protocol>://<host>:<port>".
   * @param readUrl Host & port of the DAppChain read/query interface, this should only be provided
   *                if it's not the same as `writeUrl`.
   */
  constructor(chainId: string, writeUrl: string, readUrl?: string)
  /**
   * Constructs a new client to read & write data from/to a Loom DAppChain.
   * @param chainId DAppChain identifier.
   * @param writeClient RPC client to use to send txs to the DAppChain.
   * @param readClient RPC client to use to query the DAppChain and listen to DAppChain events, this
   *                   should only be provided if it's not the same as `writeClient`.
   */
  constructor(chainId: string, writeClient: IJSONRPCClient, readClient?: IJSONRPCClient)
  constructor(
    chainId: string,
    writeClient: IJSONRPCClient | string,
    readClient?: IJSONRPCClient | string
  ) {
    super()
    this.chainId = chainId
    this.txBroadcaster = new TxSyncBroadcaster()

    // TODO: basic validation of the URIs to ensure they have all required components.
    this._writeClient =
      typeof writeClient === 'string' ? new WSRPCClient(writeClient) : writeClient
    this._writeClient.on(RPCClientEvent.Error, (url: string, err: any) =>
      this._emitNetEvent(url, ClientEvent.Error, err)
    )
    this._writeClient.on(RPCClientEvent.Connected, (url: string) =>
      this._emitNetEvent(url, ClientEvent.Connected)
    )
    this._writeClient.on(RPCClientEvent.Disconnected, (url: string) =>
      this._emitNetEvent(url, ClientEvent.Disconnected)
    )

    if (!readClient || writeClient === readClient) {
      this._readClient = this._writeClient
    } else {
      this._readClient = typeof readClient === 'string' ? new WSRPCClient(readClient) : readClient
      this._readClient.on(RPCClientEvent.Error, (url: string, err: any) =>
        this._emitNetEvent(url, ClientEvent.Error, err)
      )
      this._readClient.on(RPCClientEvent.Connected, (url: string) =>
        this._emitNetEvent(url, ClientEvent.Connected)
      )
      this._readClient.on(RPCClientEvent.Disconnected, (url: string) =>
        this._emitNetEvent(url, ClientEvent.Disconnected)
      )
    }

    const emitContractEvent = (url: string, event: IJSONRPCEvent) =>
      this._emitContractEvent(url, event)

    this.on('newListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.on(RPCClientEvent.Message, emitContractEvent)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.removeListener(RPCClientEvent.Message, emitContractEvent)
      }
    })
  }

  /**
   * Cleans up all underlying network resources.
   * Once disconnected the client can no longer be used to interact with the DAppChain.
   */
  disconnect() {
    this._writeClient.disconnect()
    if (this._readClient && this._readClient != this._writeClient) {
      this._readClient.disconnect()
    }
  }

  /**
   * Commits a transaction to the DAppChain.
   *
   * Consider using Contract.callAsync() instead.
   *
   * @param tx Transaction to commit.
   * @param opts Options object.
   * @param opts.middleware Middleware to apply before sending the tx to the DAppChain, setting this
   *                        option will override the default set of middleware specified in
   *                        the `Client.txMiddleware` property.
   * @returns Result (if any) returned by the tx handler in the contract that processed the tx.
   */
  async commitTxAsync<T extends Message>(
    tx: T,
    opts: { middleware?: ITxMiddlewareHandler[] } = {}
  ): Promise<Uint8Array | void> {
    const { middleware = this.txMiddleware } = opts
    let txBytes = tx.serializeBinary()
    for (let i = 0; i < middleware.length; i++) {
      txBytes = await middleware[i].Handle(txBytes)
    }
    let result: IBroadcastTxCommitResult
    try {
      result = await this.txBroadcaster.broadcast(this._writeClient, txBytes)
    } catch (err) {
      // Allow the middleware to handle errors. They're applied in reverse order so that the last
      // middleware that was applied to the tx that was sent will be get to handle the error first.
      for (let i = middleware.length - 1; i >= 0; i--) {
        if (middleware[i].handleError) {
          middleware[i].handleError!(err)
        }
      }
      if (isTxAlreadyInCacheError(err)) {
        throw new Error(TX_ALREADY_EXISTS_ERROR)
      }
      throw err
    }

    debugLog(`Result ${JSON.stringify(result, null, 2)}`)

    if (result) {
      let results = { validation: result.check_tx, commit: result.deliver_tx }
      // Allow the middleware to detect specific error conditions, and throw more precise errors
      for (let i = middleware.length - 1; i >= 0; i--) {
        if (middleware[i].HandleResults) {
          results = middleware[i].HandleResults!(results)
        }
      }
      // Throw generic errors if the tx failed
      if ((result.check_tx.code || 0) != 0) {
        if (!result.check_tx.log) {
          throw new Error(`Failed to commit Tx: ${result.check_tx.code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.check_tx.log}`)
      }
      if ((result.deliver_tx.code || 0) != 0) {
        if (!result.deliver_tx.log) {
          throw new Error(`Failed to commit Tx: ${result.deliver_tx.code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.deliver_tx.log}`)
      }
      if (result.deliver_tx.data) {
        return B64ToUint8Array(result.deliver_tx.data)
      }
    }
  }

  /**
   * addListenerForTopics
   */
  async addListenerForTopics() {
    const emitContractEvent = (url: string, event: IJSONRPCEvent) => {
      this._emitContractEvent(url, event, true)
    }

    this._readClient.on(RPCClientEvent.EVMMessage, emitContractEvent)
  }

  /**
   * Queries the current state of a contract.
   *
   * Consider using Contract.staticCallAsync() instead.
   */
  async queryAsync(
    contract: Address,
    query?: Uint8Array,
    vmType: VMType = VMType.PLUGIN,
    caller?: Address
  ): Promise<Uint8Array | void> {
    const result = await this._readClient.sendAsync<string>('query', {
      contract: contract.local.toString(),
      query: query ? Uint8ArrayToB64(query) : undefined,
      vmType: vmType,
      caller: caller ? caller.toString() : undefined
    })
    if (result) {
      return B64ToUint8Array(result)
    }
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
  async newPendingTransactionEvmFilterAsync(): Promise<string | null> {
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

  /**
   * Gets the number of the latest block
   *
   * @return The block height
   */
  getBlockHeightAsync(): Promise<number> {
    return this._readClient.sendAsync<number>('getblockheight', {})
  }

  /**
   * Gets a nonce for the account identified by the given public key.
   *
   * This should only be called by middleware.
   *
   * @param key A hex encoded public key.
   * @return The nonce.
   */
  async getNonceAsync(key: string): Promise<number> {
    return this.getAccountNonceAsync({ key })
  }

  /**
   * Gets a nonce for the account identified by the given public key or address.
   *
   * Only the key or the account needs to be provided, if both are provided the key is ignored.
   * This should only be called by middleware.
   *
   * @param key A hex encoded public key.
   * @parma account Account address prefixed by the chain ID, in the form chainID:0xdeadbeef
   * @return The nonce.
   */
  async getAccountNonceAsync(params: { key?: string; account?: string }): Promise<number> {
    return parseInt(await this._writeClient.sendAsync<string>('nonce', params), 10)
  }

  /**
   * Tries to resolve a contract name to an address.
   *
   * @param contractName Name of a smart contract on a Loom DAppChain.
   * @returns Contract address, or null if a contract matching the given name wasn't found.
   */
  async getContractAddressAsync(contractName: string): Promise<Address | null> {
    const addrStr = await this._readClient.sendAsync<string>('resolve', { name: contractName })
    if (!addrStr) {
      return null
    }

    debugLog(`Found contract ${contractName} with address ${Address.fromString(addrStr)}`)
    return Address.fromString(addrStr)
  }

  private _emitContractEvent(url: string, event: IJSONRPCEvent, isEVM: boolean = false): void {
    const { error, result } = event
    if (error) {
      const eventArgs: IClientErrorEventArgs = { kind: ClientEvent.Error, url, error }
      this.emit(ClientEvent.Error, eventArgs)
    } else if (result) {
      debugLog('Event', event.id, result)

      // Ugh, no built-in JSON->Protobuf marshaller apparently
      // https://github.com/google/protobuf/issues/1591 so gotta do this manually
      const eventArgs: IChainEventArgs = {
        id: event.id,
        kind: isEVM ? ClientEvent.EVMEvent : ClientEvent.Contract,
        url,
        contractAddress: new Address(
          result.address.chain_id,
          new LocalAddress(B64ToUint8Array(result.address.local))
        ),
        callerAddress: new Address(
          result.caller.chain_id,
          new LocalAddress(B64ToUint8Array(result.caller.local))
        ),
        blockHeight: result.block_height,
        data: B64ToUint8Array(result.encoded_body || '0x0'),
        topics: result.topics,
        transactionHash: result.tx_hash,
        transactionHashBytes: result.tx_hash ? B64ToUint8Array(result.tx_hash) : new Uint8Array([])
      }

      if (isEVM) this.emit(ClientEvent.EVMEvent, eventArgs)
      else this.emit(ClientEvent.Contract, eventArgs)
    }
  }

  private _emitNetEvent(
    url: string,
    kind: ClientEvent.Connected | ClientEvent.Disconnected | ClientEvent.Error,
    error?: any
  ) {
    if (kind === ClientEvent.Error) {
      const eventArgs: IClientErrorEventArgs = { kind, url, error }
      this.emit(kind, eventArgs)
    } else {
      const eventArgs: IClientEventArgs = { kind, url }
      this.emit(kind, eventArgs)
    }
  }
}
