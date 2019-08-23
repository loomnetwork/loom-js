import debug from 'debug'
import retry from 'retry'
import { Wallet } from 'ethers'
import { EthRPCMethod, IEthRPCPayload } from './loom-provider'
import { hexToNumber } from './crypto-utils'

const log = debug('loom-provider-2')
const error = debug('loom-provider-2:error')

export class LoomProvider2 {
  private _idCounter = 0
  private _wallet: Wallet
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
    // Methods from LoomProvider2
    this._ethRPCMethods = new Map<string, EthRPCMethod>()

    // Notifications for Web3
    this.notificationCallbacks = new Array()

    // If no privakey passed generate a random wallet
    this._wallet = ecdsaPrivateKey ? new Wallet(ecdsaPrivateKey) : Wallet.createRandom()

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

  // Adapter function for async / await
  async sendAsync(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.send(payload, (error: any, val: any) => {
        if (error) reject(error)
        else resolve(val)
      })
    })
  }

  async send(payload: any, callback: Function) {
    log('Request payload', JSON.stringify(payload, null, 2))

    const isArray = Array.isArray(payload)
    if (isArray) {
      payload = payload[0]
    }

    payload.id = this._idCounter++

    try {
      let methodToCall = this._ethRPCMethods.get(payload.method)

      if (methodToCall) {
        const result = await methodToCall(payload)
        callback(null, this._okResponse(payload.id, result, isArray))
      } else {
        // Call loomchain from here
      }
    } catch (err) {
      error(err)
      callback(err, null)
    }
  }

  disconnect() {
    log(`Disconnect`)
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

    log(`Next nonce ${nonce.result}`)

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

    log(`Signed transaction ${JSON.stringify(transaction, null, 2)} ${signedTransaction}`)

    const tx = await this.sendAsync({
      id: 0,
      method: 'eth_sendRawTransaction',
      params: [signedTransaction]
    })

    return tx.result
  }

  // Basic response to web3js
  private _okResponse(id: number, result: any = 0, isArray: boolean = false): any {
    const response = { id, jsonrpc: '2.0', result }
    const ret = isArray ? [response] : response
    log('Response payload', JSON.stringify(ret, null, 2))
    return ret
  }
}
