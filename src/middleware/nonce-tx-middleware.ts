import debug from 'debug'
import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client } from '../client'
import { bytesToHex } from '../crypto-utils'

const log = debug('nonce-tx-middleware')

/**
 * Wraps data in a NonceTx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export class NonceTxMiddleware implements ITxMiddlewareHandler {
  private _publicKey: Uint8Array
  private _client: Client
  private _nonceCount: number | null

  constructor(publicKey: Uint8Array, client: Client) {
    this._publicKey = publicKey
    this._client = client
    this._nonceCount = null
  }

  get nonceCount() {
    return this._nonceCount
  }

  resetNonce() {
    this._nonceCount = null
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this._nonceCount) {
      log('Nonce not found getting from loomchain')
      try {
        const key = bytesToHex(this._publicKey)
        this._nonceCount = await this._client.getNonceAsync(key)
      } catch (err) {
        throw Error('Failed to obtain latest nonce')
      }
    }

    this._nonceCount++
    log(`Next nonce ${this._nonceCount}`)

    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(this._nonceCount)
    return tx.serializeBinary()
  }
}
