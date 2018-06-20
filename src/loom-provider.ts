import debug from 'debug'
import { Client, ClientEvent, IChainEventArgs } from './client'
import { createDefaultTxMiddleware } from './helpers'
import {
  CallTx,
  MessageTx,
  Transaction,
  VMType,
  DeployTx,
  DeployResponse,
  DeployResponseData,
  EventData,
  EthFilterLog,
  EthFilterLogList,
  EvmTxReceipt,
  EthBlockInfo
} from './proto/loom_pb'
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
  private _topicsList: Array<string>
  protected notificationCallbacks: Array<Function>
  readonly accounts: Map<string, Uint8Array>
  readonly accountsAddrList: Array<string>

  /**
   * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
   *
   * @param client Client from LoomJS
   * @param privateKey Account private key
   */
  constructor(client: Client, privateKey: Uint8Array) {
    this._client = client
    this._topicsList = []
    this.notificationCallbacks = new Array()
    this.accounts = new Map<string, Uint8Array>()
    this.accountsAddrList = new Array()

    this._client.addListener(ClientEvent.Contract, (msg: IChainEventArgs) =>
      this._onWebSocketMessage(msg)
    )

    this.addDefaultEvents()
    this.addAccounts([privateKey])
  }

  /**
   * Creates new accounts by passing the private key array
   *
   * Accounts will be available on public properties accounts and accountsAddrList
   *
   * @param accountsPrivateKey Array of private keys to create new accounts
   */
  addAccounts(accountsPrivateKey: Array<Uint8Array>) {
    accountsPrivateKey.forEach(accountPrivateKey => {
      const publicKey = publicKeyFromPrivateKey(accountPrivateKey)
      const accountAddress = LocalAddress.fromPublicKey(publicKey).toString()
      this.accountsAddrList.push(accountAddress)
      this.accounts.set(accountAddress, accountPrivateKey)
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
    this._topicsList = []
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
    if (this.accountsAddrList.length === 0) {
      throw Error('No account available')
    }
    return this.accountsAddrList
  }

  private _ethBlockNumber() {
    return numberToHex(+this._client.getBlockHeightAsync())
  }

  private async _ethCall(payload: IEthRPCPayload) {
    // Sending a static call to Loom DAppChain
    const result = await this._callStaticAsync(payload.params[0])
    return bytesToHexAddrLC(result)
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

    return [bytesToHexAddrLC(result)]
  }

  private async _ethGetLogs(payload: IEthRPCPayload) {
    return this._getLogs(JSON.stringify(payload.params[0]))
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
    const result = await this._client.newEvmFilterAsync(JSON.stringify(payload.params[0]))

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

  private _ethSubscribe(payload: IEthRPCPayload) {
    // Required to avoid web3js error, because web3js always want to know about a transaction
    if (payload.params[0] === 'logs') {
      this._topicsList = this._topicsList.concat(payload.params[1].topics)
      return payload.params[1].topics[0]
    } else {
      return []
    }
  }

  private _ethUninstallFilter(payload: IEthRPCPayload) {
    return this._client.uninstallEvmFilterAsync(payload.params[0])
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

    const data = Buffer.from(payload.data.substring(2), 'hex')

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

  private async _getReceipt(txHash: string): Promise<IEthReceipt> {
    const data = Buffer.from(txHash.substring(2), 'hex')
    const receipt = await this._client.getEvmTxReceiptAsync(bufferToProtobufBytes(data))
    if (!receipt) {
      throw Error('Receipt cannot be empty')
    }

    return this._createReceiptResult(receipt)
  }

  private async _getLogs(filter: string): Promise<any> {
    const logsListAsyncResult = await this._client.getEvmLogsAsync(filter)

    if (!logsListAsyncResult) {
      return []
    }

    const logList = EthFilterLogList.deserializeBinary(bufferToProtobufBytes(logsListAsyncResult))
    return logList.getEthBlockLogsList().map((log: EthFilterLog) => {
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
      }
    })
  }

  private _onWebSocketMessage(msgEvent: IChainEventArgs) {
    if (msgEvent.data) {
      log(`Socket message arrived ${msgEvent}`)
      this.notificationCallbacks.forEach((callback: Function) => {
        const topicIdxFound = this._topicsList.indexOf(msgEvent.topics[0])

        if (topicIdxFound !== -1) {
          const topicFound = this._topicsList[topicIdxFound]
          const JSONRPCResult = {
            jsonrpc: '2.0',
            method: 'eth_subscription',
            params: {
              // TODO: This ID Should came from loomchain events
              subscription: topicFound,
              result: {
                transactionHash: msgEvent.transactionHash,
                address: msgEvent.contractAddress.local.toString(),
                type: 'mined',
                data: bytesToHexAddrLC(msgEvent.data),
                topics: msgEvent.topics
              }
            }
          }

          callback(JSONRPCResult)
        }
      })
    }
  }

  private async _commitTransaction(
    fromPublicAddr: string,
    txTransaction: Transaction
  ): Promise<Uint8Array | void> {
    const privateKey = this.accounts.get(fromPublicAddr)

    if (!privateKey) {
      throw Error(`Account not found for address ${fromPublicAddr}`)
    }

    const middleware = createDefaultTxMiddleware(this._client, privateKey)
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
