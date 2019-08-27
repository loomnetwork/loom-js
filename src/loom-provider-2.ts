import debug from 'debug'
import retry from 'retry'
import { Wallet } from 'ethers'
import { Client as WSClient } from 'rpc-websockets'
import { EthRPCMethod, IEthRPCPayload } from './loom-provider'
import { hexToNumber } from './crypto-utils'
import { EventEmitter } from 'events'

const debugLog = debug('loom-provider-2')
const eventLog = debug('loom-provider-2:event')
const errorLog = debug('loom-provider-2:error')

export class LoomProvider2 {
  private _wallet: Wallet
  private _wsRPC: WSClient
  private _ethRPCMethods: Map<string, EthRPCMethod>
  protected notificationCallbacks: Array<Function>

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

  constructor(public host: string, private ecdsaPrivateKey?: string) {
    // Simply create socket
    this._wsRPC = new WSClient(host)

    // Methods from LoomProvider2
    this._ethRPCMethods = new Map<string, EthRPCMethod>()

    // Notifications for Web3
    this.notificationCallbacks = new Array()

    // If no privakey passed generate a random wallet
    this._wallet = ecdsaPrivateKey ? new Wallet(ecdsaPrivateKey) : Wallet.createRandom()

    this._wsRPC.once('open', () => {
      ;((this._wsRPC as any).socket as EventEmitter).on(
        'message',
        this._onWebSocketMessage.bind(this)
      )
      ;((this._wsRPC as any).socket as WebSocket).onclose = () => {
        this.reset()
      }
    })

    this.addDefaultMethods()
  }

  get wallet(): Wallet {
    return this._wallet
  }

  addDefaultMethods() {
    this._ethRPCMethods.set('eth_accounts', this._ethAccounts.bind(this))
    this._ethRPCMethods.set('eth_gasPrice', this._ethGasPrice.bind(this))
    this._ethRPCMethods.set('eth_sendTransaction', this._ethSendTransaction.bind(this))
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

  async send(payload: any, callback: Function) {
    const isArray = Array.isArray(payload)
    if (isArray) {
      payload = payload[0]
    }

    debugLog('New Payload', JSON.stringify(payload, null, 2))

    if (!this._wsRPC.ready) {
      debugLog('Socket not ready resched call', payload)

      setTimeout(() => {
        this.send(payload, callback)
      }, 1000)

      return
    }

    let result

    try {
      if (this._ethRPCMethods.has(payload.method)) {
        const f: Function = this._ethRPCMethods.get(payload.method)!
        result = await f(payload)
      } else {
        result = await this._wsRPC.call(payload.method, payload.params)
      }

      callback(null, this._okResponse(payload.id, result, isArray))
    } catch (err) {
      errorLog(err)
      callback(err, null)
    }
  }

  // PRIVATE FUNCTIONS EVM CALLS

  private async _ethAccounts() {
    const address = await this.wallet.getAddress()
    return [address]
  }

  private _ethGasPrice() {
    // Loom DAppChain doesn't use gas price
    // This method can be overwritten if necessary
    return null // Returns null to afford with Web3 calls
  }

  private async _ethSendTransaction(payload: IEthRPCPayload) {
    const params: any = payload.params[0]

    const account = await this.wallet.getAddress()

    // Get the nonce for the next tx
    const nonce = await this.sendAsync({
      id: 0,
      method: 'eth_getTransactionCount',
      params: [account, 'latest']
    })

    debugLog(`Next nonce ${nonce.result}`)

    // Create transaction
    const transaction: any = {
      nonce: hexToNumber(nonce.result) + 1,
      data: params.data,
      gasPrice: '0x0'
    }

    if (params.to) {
      transaction.to = params.to
    }

    if (params.value) {
      transaction.value = params.value
    }

    const signedTransaction = await this.wallet.sign(transaction)

    debugLog(`Signed transaction ${JSON.stringify(transaction, null, 2)} ${signedTransaction}`)

    const tx = await this.sendAsync({
      id: 0,
      method: 'eth_sendRawTransaction',
      params: [signedTransaction]
    })

    return tx.result
  }

  on(type: string, callback: any) {
    if (typeof callback !== 'function') {
      throw new Error('The second parameter callback must be a function.')
    }

    eventLog('On event', type)

    switch (type) {
      case 'data':
        this.notificationCallbacks.push(callback)
        break
      case 'connect':
        ;((this._wsRPC as any).socket as WebSocket).onopen = callback
        break
      case 'end':
        ;((this._wsRPC as any).socket as WebSocket).onclose = callback
        break
      case 'error':
        ;((this._wsRPC as any).socket as WebSocket).onerror = callback
        break
    }
  }

  removeListener(type: string, callback: (...args: any[]) => void) {
    eventLog('Remove listner', type)

    switch (type) {
      case 'data':
        this.notificationCallbacks.forEach((cb, index) => {
          if (cb === callback) {
            this.notificationCallbacks.splice(index, 1)
          }
        })
        break
    }
  }

  removeAllListeners(type: string) {
    eventLog('Remove all listeners of type', type)

    switch (type) {
      case 'data':
        this.notificationCallbacks = []
        break
      case 'connect':
        ;((this._wsRPC as any).socket as WebSocket).onopen = null
        break
      case 'end':
        ;((this._wsRPC as any).socket as WebSocket).onclose = null
        break
      case 'error':
        ;((this._wsRPC as any).socket as WebSocket).onerror = null
        break
    }
  }

  reset() {
    eventLog('Reset notifications')
    this.notificationCallbacks = []
  }

  disconnect() {
    debugLog(`Disconnect`)
    this._wsRPC.close(1000, 'bye')
  }

  _onWebSocketMessage(jsonResult: any) {
    try {
      const result = JSON.parse(jsonResult)

      if (result && result.method && result.method.indexOf('_subscription') !== -1) {
        eventLog('New socket event', jsonResult)

        this.notificationCallbacks.forEach((callback: Function) => {
          callback(result)
        })
      }
    } catch (err) {
      errorLog(err)
    }
  }

  // Basic response to web3js
  private _okResponse(id: number, result: any = 0, isArray: boolean = false): any {
    const response = { id, jsonrpc: '2.0', result }
    const ret = isArray ? [response] : response
    debugLog('Response payload', JSON.stringify(ret, null, 2))
    return ret
  }
}
