import debug from 'debug'
import BN from 'bn.js'
import { ecsign, toBuffer } from 'ethereumjs-util'
import retry from 'retry'

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
  EthTxHashList,
  EvmTxObject
} from './proto/evm_pb'
import { Address, LocalAddress } from './address'
import {
  bytesToHexAddr,
  numberToHex,
  bufferToProtobufBytes,
  publicKeyFromPrivateKey,
  hexToNumber
} from './crypto-utils'
import { soliditySha3 } from './sign-helpers'
import { marshalBigUIntPB } from './big-uint'
import { SignedEthTxMiddleware } from './middleware'

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

export type SetupMiddlewareFunction = (
  client: Client,
  privateKey: Uint8Array
) => ITxMiddlewareHandler[]

export type EthRPCMethod = (payload: IEthRPCPayload) => any

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
  private _subscribed: boolean = false
  private _accountMiddlewares: Map<string, Array<ITxMiddlewareHandler>>
  private _setupMiddlewares: SetupMiddlewareFunction
  private _netVersionFromChainId: number
  private _ethRPCMethods: Map<string, EthRPCMethod>
  protected notificationCallbacks: Array<Function>
  readonly accounts: Map<string, Uint8Array | null>

  /**
   * The retry strategy that should be used to retry some web3 requests.
   * By default failed requested won't be resent.
   * To understand how to tweak the retry strategy see
   * https://github.com/tim-kos/node-retry#retrytimeoutsoptions
   */
  retryStrategy: retry.OperationOptions = {
    retries: 0,
    minTimeout: 1000, // 1s
    maxTimeout: 30000, // 30s
    randomize: true
  }

  /**
   * Overrides the chain ID of the caller, when this is `null` the caller chain ID defaults
   * to the client chain ID.
   */
  callerChainId: string | null = null

  /**
   * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
   *
   * @param client Client from LoomJS
   * @param privateKey Account private key
   */
  constructor(
    client: Client,
    privateKey: Uint8Array,
    setupMiddlewaresFunction?: SetupMiddlewareFunction
  ) {
    this._client = client
    this._netVersionFromChainId = LoomProvider.chainIdToNetVersion(this._client.chainId)
    this._setupMiddlewares = setupMiddlewaresFunction!
    this._accountMiddlewares = new Map<string, Array<ITxMiddlewareHandler>>()
    this._ethRPCMethods = new Map<string, EthRPCMethod>()
    this.notificationCallbacks = new Array()
    this.accounts = new Map<string, Uint8Array>()

    // Only subscribe for event emitter do not call subevents
    this._client.addListener(ClientEvent.EVMEvent, (msg: IChainEventArgs) =>
      this._onWebSocketMessage(msg)
    )

    if (!this._setupMiddlewares) {
      this._setupMiddlewares = (client: Client, privateKey: Uint8Array) => {
        return createDefaultTxMiddleware(client, privateKey as Uint8Array)
      }
    }

    this.addDefaultMethods()
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
        this._setupMiddlewares(this._client, accountPrivateKey)
      )
      log(`New account added ${accountAddress}`)
    })
  }

  /**
   * Set an array of middlewares for a given account
   *
   * @param address Address to be register the middleware
   * @param middlewares Array of middlewares for the address
   */
  setMiddlewaresForAddress(address: string, middlewares: Array<ITxMiddlewareHandler>) {
    this.accounts.set(address.toLowerCase(), null)
    this._accountMiddlewares.set(address.toLowerCase(), middlewares)
  }

  get accountMiddlewares(): Map<string, Array<ITxMiddlewareHandler>> {
    return this._accountMiddlewares
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

  addDefaultMethods() {
    this._ethRPCMethods.set('eth_accounts', this._ethAccounts)
    this._ethRPCMethods.set('eth_blockNumber', this._ethBlockNumber)
    this._ethRPCMethods.set('eth_call', this._ethCall)
    this._ethRPCMethods.set('eth_estimateGas', this._ethEstimateGas)
    this._ethRPCMethods.set('eth_gasPrice', this._ethGasPrice)
    this._ethRPCMethods.set('eth_getBalance', this._ethGetBalance)
    this._ethRPCMethods.set('eth_getBlockByHash', this._ethGetBlockByHash)
    this._ethRPCMethods.set('eth_getBlockByNumber', this._ethGetBlockByNumber)
    this._ethRPCMethods.set('eth_getCode', this._ethGetCode)
    this._ethRPCMethods.set('eth_getFilterChanges', this._ethGetFilterChanges)
    this._ethRPCMethods.set('eth_getLogs', this._ethGetLogs)
    this._ethRPCMethods.set('eth_getTransactionByHash', this._ethGetTransactionByHash)
    this._ethRPCMethods.set('eth_getTransactionReceipt', this._ethGetTransactionReceipt)
    this._ethRPCMethods.set('eth_newBlockFilter', this._ethNewBlockFilter)
    this._ethRPCMethods.set('eth_newFilter', this._ethNewFilter)
    this._ethRPCMethods.set(
      'eth_newPendingTransactionFilter',
      this._ethNewPendingTransactionFilter
    )
    this._ethRPCMethods.set('eth_sendTransaction', this._ethSendTransaction)
    this._ethRPCMethods.set('eth_sign', this._ethSign)
    this._ethRPCMethods.set('eth_subscribe', this._ethSubscribe)
    this._ethRPCMethods.set('eth_uninstallFilter', this._ethUninstallFilter)
    this._ethRPCMethods.set('eth_unsubscribe', this._ethUnsubscribe)
    this._ethRPCMethods.set('net_version', this._netVersion)
  }

  /**
   * Adds custom methods to the provider when a particular method isn't supported
   *
   * Throws if the added method already exists
   *
   * @param method name of the method to be added
   * @param customMethodFn function that will implement the method
   */
  addCustomMethod(method: string, customMethodFn: EthRPCMethod) {
    if (this._ethRPCMethods.has(method)) {
      throw Error('Method already exists')
    }

    this._ethRPCMethods.set(method, customMethodFn)
  }

  /**
   * Overwrites existing method on the provider
   *
   * Throws if the overwritten method doesn't exists
   *
   * @param method name of the method to be overwritten
   * @param customMethodFn function that will implement the method
   */
  overwriteMethod(method: string, customMethodFn: EthRPCMethod) {
    if (!this._ethRPCMethods.has(method)) {
      throw Error('Method to overwrite do not exists')
    }

    this._ethRPCMethods.set(method, customMethodFn)
  }

  /**
   * Return the numerical representation of the ChainId
   * More details at: https://github.com/loomnetwork/loom-js/issues/110
   */
  static chainIdToNetVersion(chainId: string): number {
    // Avoids the error "Number can only safely store up to 53 bits" on Web3
    // Ensures the value less than 9007199254740991 (Number.MAX_SAFE_INTEGER)
    const chainIdHash = soliditySha3(chainId)
      .slice(2) // Removes 0x
      .slice(0, 13) // Produces safe Number less than 9007199254740991
    return new BN(chainIdHash).toNumber()
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

    const prepareMethodToCall = (method: string) => {
      const methodToCall = this._ethRPCMethods.get(method)
      if (!methodToCall) {
        throw Error(`Method "${payload.method}" not supported on this provider`)
      }
      return methodToCall
    }

    try {
      // @ts-ignore
      const f = prepareMethodToCall(payload.method).bind(this)
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

    this.accounts.forEach((_value: Uint8Array | null, key: string) => {
      accounts.push(key)
    })

    return accounts
  }

  private async _ethBlockNumber(): Promise<string> {
    const blockNumber = await this._client.getBlockHeightAsync()
    return numberToHexLC(+blockNumber)
  }

  private async _ethCall(payload: IEthRPCPayload) {
    // Sending a static call to Loom DAppChain
    const result = await this._callStaticAsync(payload.params[0])
    return result ? bytesToHexAddrLC(result) : '0x0'
  }

  private _ethEstimateGas() {
    // Loom DAppChain doesn't estimate gas
    // This method can be overwritten if necessary
    return null // Returns null to afford with Web3 calls
  }

  private _ethGetBalance() {
    // Loom DAppChain doesn't have ETH balance by default
    // This method can be overwritten if necessary
    return '0x0' // Returns 0x0 to afford with Web3 calls
  }

  private _ethGasPrice() {
    // Loom DAppChain doesn't use gas price
    // This method can be overwritten if necessary
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
    const blockNumberToSearch =
      payload.params[0] === 'latest' ? payload.params[0] : hexToNumber(payload.params[0])
    const isFull = payload.params[1] || true
    const result = await this._client.getEvmBlockByNumberAsync(`${blockNumberToSearch}`, isFull)

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

  private async _ethGetTransactionReceipt(payload: IEthRPCPayload): Promise<IEthReceipt> {
    const txHash = payload.params[0]
    const data = Buffer.from(txHash.slice(2), 'hex')
    const op = retry.operation(this.retryStrategy)
    const receipt = await new Promise<EvmTxReceipt | null>((resolve, reject) => {
      op.attempt(currentAttempt => {
        log(`Current attempt ${currentAttempt}`)
        this._client
          .getEvmTxReceiptAsync(bufferToProtobufBytes(data))
          .then(receipt => {
            if (receipt) {
              resolve(receipt)
            } else {
              const err = new Error('Receipt cannot be empty')
              error(err.message)
              if (!op.retry(err)) {
                reject(err)
              }
            }
          })
          .catch(err => {
            if (!op.retry(err)) {
              reject(err)
            } else {
              error(err.message)
            }
          })
      })
    })
    return this._createReceiptResult(receipt!)
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

  private async _ethSign(payload: IEthRPCPayload) {
    const address = payload.params[0]
    const privateKey = this.accounts.get(address)

    if (!privateKey) {
      throw Error('Account is not valid, private key not found')
    }

    const msg = payload.params[1]
    const hash = soliditySha3('\x19Ethereum Signed Message:\n32', msg).slice(2)
    const privateHash = soliditySha3(privateKey).slice(2)

    const sig = ecsign(Buffer.from(hash, 'hex'), Buffer.from(privateHash, 'hex'))
    return bytesToHexAddrLC(Buffer.concat([sig.r, sig.s, toBuffer(sig.v)]))
  }

  private async _ethSubscribe(payload: IEthRPCPayload) {
    if (!this._subscribed) {
      this._subscribed = true
      this._client.addListenerForTopics()
    }

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
    return this._netVersionFromChainId
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

  private _callAsync(payload: {
    to: string
    from: string
    data: string
    value: string
  }): Promise<any> {
    const chainId = this.callerChainId === null ? this._client.chainId : this.callerChainId
    const caller = new Address(chainId, LocalAddress.fromHexString(payload.from))

    log('caller', caller.toString())
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const data = Buffer.from(payload.data.slice(2), 'hex')
    const value = new BN((payload.value || '0x0').slice(2), 16)

    const callTx = new CallTx()
    callTx.setVmType(VMType.EVM)
    callTx.setInput(bufferToProtobufBytes(data))
    callTx.setValue(marshalBigUIntPB(value))

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
    const chainId = this.callerChainId === null ? this._client.chainId : this.callerChainId
    const caller = new Address(chainId, LocalAddress.fromHexString(payload.from))
    log('caller', caller.toString())
    const address = new Address(this._client.chainId, LocalAddress.fromHexString(payload.to))
    const data = Buffer.from(payload.data.slice(2), 'hex')
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
        return this._createTransactionResult(
          EvmTxObject.deserializeBinary(bufferToProtobufBytes(transaction))
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
      transactions,
      gasLimit: '0x0',
      gasUsed: '0x0',
      size: '0x0',
      number: '0x0'
    }
  }

  private _createTransactionResult(txObject: EvmTxObject): IEthTransaction {
    const hash = bytesToHexAddrLC(txObject.getHash_asU8())
    const nonce = numberToHexLC(txObject.getNonce())
    const blockHash = bytesToHexAddrLC(txObject.getBlockHash_asU8())
    const blockNumber = numberToHexLC(txObject.getBlockNumber())
    const transactionIndex = numberToHexLC(txObject.getTransactionIndex())
    const from = bytesToHexAddrLC(txObject.getFrom_asU8())
    const to = bytesToHexAddrLC(txObject.getTo_asU8())
    const value = `${txObject.getValue()}`
    const gas = numberToHexLC(txObject.getGas())
    const gasPrice = numberToHexLC(txObject.getGasPrice())
    const input = bytesToHexAddrLC(txObject.getInput_asU8())

    return {
      hash,
      nonce,
      blockHash,
      blockNumber,
      transactionIndex,
      from,
      to,
      value,
      gas,
      gasPrice,
      input
    } as IEthTransaction
  }

  private _createReceiptResult(receipt: EvmTxReceipt): IEthReceipt {
    const transactionHash = bytesToHexAddrLC(receipt.getTxHash_asU8())
    const transactionIndex = numberToHexLC(receipt.getTransactionIndex())
    const blockHash = bytesToHexAddrLC(receipt.getBlockHash_asU8())
    const blockNumber = numberToHexLC(receipt.getBlockNumber())
    const contractAddress = bytesToHexAddrLC(receipt.getContractAddress_asU8())
    const logs = receipt.getLogsList().map((logEvent: EventData, index: number) => {
      const logIndex = numberToHexLC(index)
      let data = bytesToHexAddrLC(logEvent.getEncodedBody_asU8())

      if (data === '0x') {
        data = '0x0'
      }

      return {
        logIndex,
        address: contractAddress,
        blockHash,
        blockNumber,
        blockTime: logEvent.getBlockTime(),
        transactionHash: bytesToHexAddrLC(logEvent.getTxHash_asU8()),
        transactionIndex,
        type: 'mined',
        data,
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
    const data = Buffer.from(txHash.slice(2), 'hex')
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

  private _createLogResult(log: EthFilterLog): IEthFilterLog {
    return {
      removed: log.getRemoved(),
      blockTime: log.getBlockTime(),
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
    if (msgEvent.kind === ClientEvent.EVMEvent) {
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
              blockNumber: numberToHexLC(+msgEvent.blockHeight),
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
    log('Middlewares used', middleware)
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
