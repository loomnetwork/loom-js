import debug from 'debug'

import { AbstractMethod } from 'web3-core-method/types'
import { AbstractWeb3Module } from 'web3-core/types'
import EthereumJSTx from 'ethereumjs-tx'

import { publicKeyFromPrivateKey } from './crypto-utils'
import { LocalAddress } from './address'
import { EthRPCMethod, IEthRPCPayload } from './loom-provider'
import { Web3Delegator } from './web3-delegator'

const debugLog = debug('loom-provider-next')
const errorLog = debug('loom-provider-next:error')

/**
 * Web3 provider that interacts with EVM contracts deployed on Loom DAppChains
 * using JSON RPC communication
 */
export class LoomProviderNext extends Web3Delegator {
  private _requestId: number = 0
  private _ethRPCMethods: Map<string, EthRPCMethod>
  private _accounts: Map<string, Uint8Array | null>

  /**
   * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
   * using the JSON RPC protocol
   *
   * Ex: const web3 = new Web3(new LoomProviderNext('http://localhost:46885/eth', privKey))
   *
   * @param {string} host HTTP or WS address of the Loomchain eth endpoint
   * @param {Uint8Array} privateKey Account private key
   */
  constructor(public host: string, privateKey: Uint8Array) {
    super(host)

    debugLog(`Starting LoomProvider ${host}`)

    // Adding accounts for private key
    this._accounts = new Map<string, Uint8Array>()
    this.addAccounts([privateKey])

    // Adding default methods
    this._ethRPCMethods = new Map<string, EthRPCMethod>()
    this._addDefaultMethods()
  }

  // PUBLIC LOOM PROVIDER FUNCTIONS

  /**
   * Creates new accounts by passing the private key array
   *
   * Accounts will be available on public properties accounts
   *
   * @param {Array<Uint8Array>} accountsPrivateKey Array of private keys to create new accounts
   */
  public addAccounts(accountsPrivateKey: Array<Uint8Array>) {
    accountsPrivateKey.forEach(accountPrivateKey => {
      const publicKey = publicKeyFromPrivateKey(accountPrivateKey)
      const accountAddress = LocalAddress.fromPublicKey(publicKey).toString()
      this._accounts.set(this._web3.utils.toChecksumAddress(accountAddress), accountPrivateKey)
      debugLog(`New account added ${accountAddress}`)
    })
  }

  // WEB3 PUBLIC METHODS

  /**
   * Creates the JSON-RPC payload and sends it to the node.
   *
   * @method send
   *
   * @param {String} method
   * @param {Array} parameters
   *
   * @returns {Promise<Object>}
   */
  async send(method: string, params: any[]): Promise<any> {
    const id = this._requestId++
    return this.sendPayload({ method, id, params } as IEthRPCPayload)
  }

  /**
   * Creates the JSON-RPC batch payload and sends it to the node.
   *
   * @method sendBatch
   *
   * @param {AbstractMethod[]} methods
   * @param {AbstractWeb3Module} moduleInstance
   *
   * @returns Promise<Object|Error>
   */
  async sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]> {
    return Promise.reject(['Not implemented'])
  }

  /**
   * Sends the JSON-RPC payload to the node.
   *
   * @method sendPayload
   *
   * @param {Object} payload
   *
   * @returns {Promise<any>}
   */
  async sendPayload(payload: IEthRPCPayload): Promise<any> {
    debugLog('Request payload', JSON.stringify(payload, null, 2))

    try {
      let result
      // If the method is on LoomProvider do not call loomchain
      if (this._ethRPCMethods.has(payload.method)) {
        const func: any = this._ethRPCMethods.get(payload.method)!
        result = await func(payload)
      } else {
        result = await this._web3.currentProvider.send(payload.method, payload.params)
      }

      return result
    } catch (err) {
      errorLog(err)
      return err
    }
  }

  // PRIVATE METHODS

  /**
   * Adding default methos to overwrite the Web3 calls
   */
  private _addDefaultMethods() {
    this._ethRPCMethods.set('eth_accounts', () => this._ethAccounts())
    this._ethRPCMethods.set('eth_sendRawTransaction', (params: any) =>
      this._ethSendRawTransaction(params)
    )
    this._ethRPCMethods.set('eth_sendTransaction', (params: any) =>
      this._ethSendRawTransaction(params)
    )
  }

  /**
   * Accounts are manipulated locally not need go to Loomchain
   */
  private _ethAccounts() {
    if (this._accounts.size === 0) {
      throw Error('No account available')
    }

    const accounts = new Array<string>()
    this._accounts.forEach((_value: Uint8Array | null, key: string) => {
      accounts.push(key)
    })

    return accounts
  }

  /**
   *
   * @param {IEthRPCPayload} payload Payload of the transasction
   */
  private async _ethSendRawTransaction(payload: IEthRPCPayload) {
    const { from, to, data, value } = payload.params[0]

    const privateKey = this._accounts.get(from)

    if (!privateKey) {
      throw Error('Account is not valid, private key not found')
    }

    const nonce = await this._web3.eth.getTransactionCount(from)
    const tx = new EthereumJSTx({
      nonce,
      from,
      to,
      data,
      value
    })

    tx.sign(Buffer.from(privateKey))
    const signedTransactionData = `0x${tx.serialize().toString('hex')}`
    return this._web3.eth.sendSignedTransaction(signedTransactionData)
  }
}
