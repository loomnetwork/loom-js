import debug from 'debug'
import { Client, ClientEvent, IChainEventArgs, ITxMiddlewareHandler } from './client'
import { createDefaultTxMiddleware } from './helpers'
import {
  CallTx,
  MessageTx,
  Transaction,
  VMType,
  DeployTx,
  DeployResponse,
  DeployResponseData
} from './proto/loom_pb'
import {
  EventData,
  EthFilterLog,
  EthFilterLogList,
  EvmTxReceipt,
  EthBlockInfo,
  EthBlockHashList,
  EthTxHashList
} from './proto/evm_pb'
import { Address, LocalAddress } from './address'
import {
  bytesToHexAddr,
  numberToHex,
  bufferToProtobufBytes,
  publicKeyFromPrivateKey
} from './crypto-utils'

export interface IEthReceipt {
  transactionHash: string
  transactionIndex: string
  blockHash: string
  blockNumber: string
  gasUsed: string
  cumulativeGasUsed: string
  contractAddress: string
  logs: Array<any>
  status: string
}

export interface IEthTransaction {
  hash: string
  nonce: string
  blockHash: string
  blockNumber: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gasPrice: string
  gas: string
  input: string
}

export interface IEthBlock {
  blockNumber: string
  transactionHash: string
  parentHash: string
  logsBloom: string
  timestamp: number
  transactions: Array<IEthReceipt | string>
}

export interface IEthRPCPayload {
  id: number
  method: string
  params: Array<any>
}

export interface IEthFilterLog {
  removed: boolean
  logIndex: string
  transactionIndex: string
  transactionHash: string
  blockHash: string
  blockNumber: string
  address: string
  data: string
  topics: Array<string>
}

const log = debug('loom-provider')
const error = debug('loom-provider:error')

const bytesToHexAddrLC = (bytes: Uint8Array): string => {
  return bytesToHexAddr(bytes).toLowerCase()
}

const numberToHexLC = (num: number): string => {
  return numberToHex(num).toLowerCase()
}

/**
 * Web3 provider that interacts with EVM contracts deployed on Loom DAppChains.
 */
export class LoomProvider {
  private _client: Client
  private _accountMiddlewares: Map<string, Array<ITxMiddlewareHandler>>
  protected notificationCallbacks: Array<Function>
  readonly accounts: Map<string, Uint8Array>

  /**
   * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
   *
   * @param client Client from LoomJS
   * @param privateKey Account private key
   */
  constructor(client: Client, privateKey: Uint8Array) {
    this._client = client
    this._accountMiddlewares = new Map<string, Array<ITxMiddlewareHandler>>()
    this.notificationCallbacks = new Array()
    this.accounts = new Map<string, Uint8Array>()

    this._client.addListener(ClientEvent.Contract, (msg: IChainEventArgs) =>
      this._onWebSocketMessage(msg)
    )

    this.addDefaultEvents()
    this.addAccounts([privateKey])
  }

  /**
   * Creates new accounts by passing the private key array
   *
   * Accounts will be available on public properties accounts
   *
   * @param accountsPrivateKey Array of private keys to create new accounts
   */
  addAccounts(accountsPrivateKey: Array<Uint8Array>) {
    accountsPrivateKey.forEach(accountPrivateKey => {
      const publicKey = publicKeyFromPrivateKey(accountPrivateKey)
      const accountAddress = LocalAddress.fromPublicKey(publicKey).toString()
      this.accounts.set(accountAddress, accountPrivateKey)
      this._accountMiddlewares.set(
        accountAddress,
        createDefaultTxMiddleware(this._client, accountPrivateKey)
      )
      log(`New account added ${accountAddress}`)
    })
  }

  // PUBLIC FUNCTION TO SUPPORT WEB3

  on(type: string, callback: any) {
    switch (type) {
      case 'data':
        this.notificationCallbacks.push(callback)
        break
      case 'connect':
        this._client.addListener(ClientEvent.Connected, callback)
        break
      case 'end':
        this._client.addListener(ClientEvent.Disconnected, callback)
        break
      case 'error':
        this._client.addListener(ClientEvent.Error, callback)
        break
    }
  }

  addDefaultEvents() {
    this._client.addListener(ClientEvent.Disconnected, () => {
      // reset all requests and callbacks
      this.reset()
    })
  }

  removeListener(type: string, callback: (...args: any[]) => void) {
    switch (type) {
      case 'data':
        this.notificationCallbacks = []
        break
      case 'connect':
        this._client.removeListener(ClientEvent.Connected, callback)
        break
      case 'end':
        this._client.removeListener(ClientEvent.Disconnected, callback)
        break
      case 'error':
        this._client.removeListener(ClientEvent.Error, callback)
        break
    }
  }

  removeAllListeners(type: string, callback: Function) {
    if (type === 'data') {
      this.notificationCallbacks.forEach((cb, index) => {
        if (cb === callback) {
          this.notificationCallbacks.splice(index, 1)
        }
      })
    }
  }

  reset() {
    this.notificationCallbacks = []
  }

  disconnect() {
    this._client.disconnect()
  }

  // Adapter function for sendAsync from truffle provider
  async sendAsync(payload: any, callback?: Function): Promise<any | void> {
    if (callback) {
      await this.send(payload, callback)
    } else {
      return new Promise((resolve, reject) => {
        this.send(payload, (err: Error, result: any) => {
          if (err) reject(err)
          else resolve(result)
        })
      })
    }
  }

  /**
   * Should be used to make async request
   * This method is used internally by web3, so we adapt it to be used with loom contract
   * when we are wrapping the evm on a DAppChain
   * @param payload JSON payload generated by web3 which will be translated to loom transaction/call
   * @param callback Triggered on end with (err, result)
   */
  async send(payload: any, callback: Function) {
    log('Request payload', JSON.stringify(payload, null, 2))

    const isArray = Array.isArray(payload)
    if (isArray) {
      payload = payload[0]
    }

    const functionToExecute = (method: string) => {
      switch (method) {
        case 'eth_accounts':
          return this._ethAccounts

        case 'eth_blockNumber':
          return this._ethBlockNumber

        case 'eth_call':
          return this._ethCall

        case 'eth_estimateGas':
          return this._ethEstimateGas

        case 'eth_gasPrice':
          return this._ethGasPrice

        case 'eth_getBlockByHash':
          return this._ethGetBlockByHash

        case 'eth_getBlockByNumber':
          return this._ethGetBlockByNumber

        case 'eth_getCode':
          return this._ethGetCode

        case 'eth_getFilterChanges':
          return this._ethGetFilterChanges

        case 'eth_getLogs':
          return this._ethGetLogs

        case 'eth_getTransactionByHash':
          return this._ethGetTransactionByHash

        case 'eth_getTransactionReceipt':
          return this._ethGetTransactionReceipt

        case 'eth_newBlockFilter':
          return this._ethNewBlockFilter

        case 'eth_newFilter':
          return this._ethNewFilter

        case 'eth_newPendingTransactionFilter':
          return this._ethNewPendingTransactionFilter

        case 'eth_sendTransaction':
          return this._ethSendTransaction

        case 'eth_subscribe':
          return this._ethSubscribe

        case 'eth_uninstallFilter':
          return this._ethUninstallFilter

        case 'eth_unsubscribe':
          return this._ethUnsubscribe

        case 'net_version':
          return this._netVersion

        default:
          throw Error(`Method "${payload.method}" not supported on this provider`)
      }
    }

    try {
      const f = functionToExecute(payload.method).bind(this)
      const result = await f(payload)
      callback(null, this._okResponse(payload.id, result, isArray))
    } catch (err) {
      error(err)
      callback(err, null)
    }
  }

  // PRIVATE FUNCTIONS EVM CALLS

  private _ethAccounts() {
    if (this.accounts.size === 0) {
      throw Error('No account available')
    }

    const accounts = new Array()

    this.accounts.forEach((value: Uint8Array, key: string) => {
      accounts.push(key)
    })

    return accounts
  }

  private async _ethBlockNumber() {
    const blockNumber = await this._client.getBlockHeightAsync()
    return numberToHex(blockNumber)
  }

  private async _ethCall(payload: IEthRPCPayload) {
    // Sending a static call to Loom DAppChain
    const result = await this._callStaticAsync(payload.params[0])
    return result ? bytesToHexAddrLC(result) : '0x0'
  }

  private _ethEstimateGas() {
    // Loom DAppChain doesn't estimate gas, because gas isn't necessary
    return null // Returns null to afford with Web3 calls
  }

  private _ethGasPrice() {
    // Loom DAppChain doesn't use gas price, because gas isn't necessary
    return null // Returns null to afford with Web3 calls
  }

  private async _ethGetBlockByHash(payload: IEthRPCPayload): Promise<IEthBlock | null> {
    const blockHash = payload.params[0]
    const isFull = payload.params[1] || true

    const result = await this._client.getEvmBlockByHashAsync(blockHash, isFull)

    if (!result) {
      return null
    }

    return this._createBlockInfo(result, isFull)
  }

  private async _ethGetBlockByNumber(payload: IEthRPCPayload): Promise<IEthBlock | null> {
    const blockNumberToSearch = payload.params[0]
    const isFull = payload.params[1] || true

    const result = await this._client.getEvmBlockByNumberAsync(blockNumberToSearch, isFull)

    if (!result) {
      return null
    }

    return this._createBlockInfo(result, isFull)
  }

  private async _ethGetCode(payload: IEthRPCPayload) {
    const address = new Address(
      this._client.chainId,
      LocalAddress.fromHexString(payload.params[0])
    )
    const result = await this._client.getEvmCodeAsync(address)

    if (!result) {
      throw Error('No code returned on eth_getCode')
    }

    return bytesToHexAddrLC(result)
  }

  private async _ethGetFilterChanges(payload: IEthRPCPayload) {
    const result = await this._client.getEvmFilterChangesAsync(payload.params[0])

    if (!result) {
      return []
    }

    if (result instanceof EthBlockHashList) {
      return (result as EthBlockHashList)
        .getEthBlockHashList_asU8()
        .map((hash: Uint8Array) => bytesToHexAddrLC(hash))
    } else if (result instanceof EthTxHashList) {
      return (result as EthTxHashList)
        .getEthTxHashList_asU8()
        .map((hash: Uint8Array) => bytesToHexAddrLC(hash))
    } else if (result instanceof EthFilterLogList) {
      return (result as EthFilterLogList)
        .getEthBlockLogsList()
        .map((log: EthFilterLog) => this._createLogResult(log))
    }
  }

  private async _ethGetLogs(payload: IEthRPCPayload) {
    return this._getLogs(payload.params[0])
  }

  private async _ethGetTransactionByHash(payload: IEthRPCPayload) {
    return this._getTransaction(payload.params[0])
  }

  private async _ethGetTransactionReceipt(payload: IEthRPCPayload) {
    return this._getReceipt(payload.params[0])
  }

  private async _ethNewBlockFilter() {
    const result = await this._client.newBlockEvmFilterAsync()

    if (!result) {
      throw Error('New block filter unexpected result')
    }

    return result
  }

  private async _ethNewFilter(payload: IEthRPCPayload) {
    const result = await this._client.newEvmFilterAsync(payload.params[0])

    if (!result) {
      throw Error('Cannot create new filter on eth_newFilter')
    }

    return result
  }

  private async _ethNewPendingTransactionFilter() {
    const result = await this._client.newPendingTransactionEvmFilterAsync()

    if (!result) {
      throw Error('New pending transaction filter unexpected result')
    }

    return result
  }

  private async _ethSendTransaction(payload: IEthRPCPayload) {
    let result

    if (payload.params[0].to) {
      result = await this._callAsync(payload.params[0])
    } else {
      result = await this._deployAsync(payload.params[0])
    }

    return bytesToHexAddrLC(result)
  }

  private async _ethSubscribe(payload: IEthRPCPayload) {
    const method = payload.params[0]
    const filterObject = payload.params[1] || {}

    const result = await this._client.evmSubscribeAsync(method, filterObject)
    if (!result) {
      throw Error('Subscribe filter failed')
    }

    return result
  }

  private _ethUninstallFilter(payload: IEthRPCPayload) {
    return this._client.uninstallEvmFilterAsync(payload.params[0])
  }

  private _ethUnsubscribe(payload: IEthRPCPayload) {
    return this._client.evmUnsubscribeAsync(payload.params[0])
  }

  private _netVersion() {
    // Fixed network version 474747
    return '474747'
  }

  // PRIVATE FUNCTIONS IMPLEMENTATIONS

  private async _deployAsync(payload: { from: string; data: string }): Promise<any> {
    const caller = new Address(this._client.chainId, LocalAddress.fromHexString(payload.from))
    const address = new Address(
      this._client.chainId,
      LocalAddress.fromHexString('0x0000000000000000000000000000000000000000')
    )

    const hasHexPrefix = payload.data.substring(0, 2) === '0x'
    const data = Buffer.from(payload.data.slice(hasHexPrefix ? 2 : 0), 'hex')

    const deployTx = new DeployTx()
    deployTx.setVmType(VMType.EVM)
    deployTx.setCode(bufferToProtobufBytes(data))

    const msgTx = new MessageTx()
    msgTx.setFrom(caller.MarshalPB())
    msgTx.setTo(address.MarshalPB())
    msgTx.setData(deployTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(1)
    tx.setData(msgTx.serializeBinary())

    const ret = await this._commitTransaction(payload.from, tx)
    const response = DeployResponse.deserializeBinary(bufferToProtobufBytes(ret as Uint8Array))
    const responseData = DeployResponseData.deserializeBinary(
      bufferToProtobufBytes(response.getOutput_asU8())
    )

    return responseData.getTxHash_asU8()
  }

  private _callAsync(payload: { to: string; from: string; data: string }): Promise<any> {
    const caller = new Address(this._client.chainId, LocalAddress.fromHexString(payload.from))
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const data = Buffer.from(payload.data.substring(2), 'hex')

    const callTx = new CallTx()
    callTx.setVmType(VMType.EVM)
    callTx.setInput(bufferToProtobufBytes(data))

    const msgTx = new MessageTx()
    msgTx.setFrom(caller.MarshalPB())
    msgTx.setTo(address.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())

    return this._commitTransaction(payload.from, tx)
  }

  private _callStaticAsync(payload: { to: string; from: string; data: string }): Promise<any> {
    const caller = new Address(this._client.chainId, LocalAddress.fromHexString(payload.from))
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const data = Buffer.from(payload.data.substring(2), 'hex')
    return this._client.queryAsync(address, data, VMType.EVM, caller)
  }

  private _createBlockInfo(blockInfo: EthBlockInfo, isFull: boolean): any {
    const blockNumber = numberToHexLC(blockInfo.getNumber())
    const transactionHash = bytesToHexAddrLC(blockInfo.getHash_asU8())
    const parentHash = bytesToHexAddrLC(blockInfo.getParentHash_asU8())
    const logsBloom = bytesToHexAddrLC(blockInfo.getLogsBloom_asU8())
    const timestamp = blockInfo.getTimestamp()
    const transactions = blockInfo.getTransactionsList_asU8().map((transaction: Uint8Array) => {
      if (isFull) {
        return this._createReceiptResult(
          EvmTxReceipt.deserializeBinary(bufferToProtobufBytes(transaction))
        )
      } else {
        return bytesToHexAddrLC(transaction)
      }
    })

    return {
      blockNumber,
      transactionHash,
      parentHash,
      logsBloom,
      timestamp,
      transactions
    }
  }

  private _createReceiptResult(receipt: EvmTxReceipt): IEthReceipt {
    const transactionHash = bytesToHexAddrLC(receipt.getTxHash_asU8())
    const transactionIndex = numberToHexLC(receipt.getTransactionIndex())
    const blockHash = bytesToHexAddrLC(receipt.getBlockHash_asU8())
    const blockNumber = numberToHexLC(receipt.getBlockNumber())
    const contractAddress = bytesToHexAddrLC(receipt.getContractAddress_asU8())
    const logs = receipt.getLogsList().map((logEvent: EventData, index: number) => {
      const logIndex = numberToHexLC(index)

      return {
        logIndex,
        address: contractAddress,
        blockHash,
        blockNumber,
        transactionHash: bytesToHexAddrLC(logEvent.getTxHash_asU8()),
        transactionIndex,
        type: 'mined',
        data: bytesToHexAddrLC(logEvent.getEncodedBody_asU8()),
        topics: logEvent.getTopicsList().map((topic: string) => topic.toLowerCase())
      }
    })

    return {
      transactionHash,
      transactionIndex,
      blockHash,
      blockNumber,
      contractAddress,
      gasUsed: numberToHexLC(receipt.getGasUsed()),
      cumulativeGasUsed: numberToHexLC(receipt.getCumulativeGasUsed()),
      logs,
      status: numberToHexLC(receipt.getStatus())
    } as IEthReceipt
  }

  private async _getTransaction(txHash: string): Promise<IEthTransaction> {
    const data = Buffer.from(txHash.substring(2), 'hex')
    const transaction = await this._client.getEvmTxByHashAsync(bufferToProtobufBytes(data))
    if (!transaction) {
      throw Error('Transaction cannot be empty')
    }

    const hash = bytesToHexAddrLC(transaction.getHash_asU8())
    const nonce = numberToHexLC(transaction.getNonce())
    const transactionIndex = numberToHexLC(transaction.getTransactionIndex())
    const blockHash = bytesToHexAddrLC(transaction.getBlockHash_asU8())
    const blockNumber = numberToHexLC(transaction.getBlockNumber())
    const from = bytesToHexAddrLC(transaction.getFrom_asU8())
    const to = bytesToHexAddrLC(transaction.getTo_asU8())
    const value = numberToHexLC(transaction.getValue())
    const gasPrice = numberToHexLC(transaction.getGasPrice())
    const gas = numberToHexLC(transaction.getGas())
    const input = '0x0'

    return {
      hash,
      nonce,
      blockHash,
      blockNumber,
      transactionIndex,
      from,
      to,
      value,
      gasPrice,
      gas,
      input
    } as IEthTransaction
  }

  private async _getReceipt(txHash: string): Promise<IEthReceipt> {
    const data = Buffer.from(txHash.substring(2), 'hex')
    const receipt = await this._client.getEvmTxReceiptAsync(bufferToProtobufBytes(data))
    if (!receipt) {
      throw Error('Receipt cannot be empty')
    }

    return this._createReceiptResult(receipt)
  }

  private _createLogResult(log: EthFilterLog): IEthFilterLog {
    return {
      removed: log.getRemoved(),
      logIndex: numberToHexLC(log.getLogIndex()),
      transactionIndex: numberToHex(log.getTransactionIndex()),
      transactionHash: bytesToHexAddrLC(log.getTransactionHash_asU8()),
      blockHash: bytesToHexAddrLC(log.getBlockHash_asU8()),
      blockNumber: numberToHex(log.getBlockNumber()),
      address: bytesToHexAddrLC(log.getAddress_asU8()),
      data: bytesToHexAddrLC(log.getData_asU8()),
      topics: log.getTopicsList().map((topic: any) => String.fromCharCode.apply(null, topic))
    } as IEthFilterLog
  }

  private async _getLogs(filterObject: Object): Promise<Array<IEthFilterLog>> {
    const logsListAsyncResult = await this._client.getEvmLogsAsync(filterObject)

    if (!logsListAsyncResult) {
      return []
    }

    const logList = EthFilterLogList.deserializeBinary(bufferToProtobufBytes(logsListAsyncResult))
    return logList.getEthBlockLogsList().map((log: EthFilterLog) => {
      return this._createLogResult(log)
    })
  }

  private _onWebSocketMessage(msgEvent: IChainEventArgs) {
    if (msgEvent.data && msgEvent.id !== '0') {
      log(`Socket message arrived ${JSON.stringify(msgEvent)}`)
      this.notificationCallbacks.forEach((callback: Function) => {
        const JSONRPCResult = {
          jsonrpc: '2.0',
          method: 'eth_subscription',
          params: {
            subscription: msgEvent.id,
            result: {
              transactionHash: bytesToHexAddrLC(msgEvent.transactionHashBytes),
              logIndex: '0x0',
              transactionIndex: '0x0',
              blockHash: '0x0',
              blockNumber: '0x0',
              address: msgEvent.contractAddress.local.toString(),
              type: 'mined',
              data: bytesToHexAddrLC(msgEvent.data),
              topics: msgEvent.topics
            }
          }
        }

        callback(JSONRPCResult)
      })
    }
  }

  private async _commitTransaction(
    fromPublicAddr: string,
    txTransaction: Transaction
  ): Promise<Uint8Array | void> {
    const middleware = this._accountMiddlewares.get(fromPublicAddr)
    return this._client.commitTxAsync<Transaction>(txTransaction, { middleware })
  }

  // Basic response to web3js
  private _okResponse(id: number, result: any = 0, isArray: boolean = false): any {
    const response = { id, jsonrpc: '2.0', result }
    const ret = isArray ? [response] : response
    log('Response payload', JSON.stringify(ret, null, 2))
    return ret
  }
}
