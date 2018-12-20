import debug from 'debug'
import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client, ITxResults } from '../client'
import { bytesToHex } from '../crypto-utils'
import { INVALID_TX_NONCE_ERROR } from './nonce-tx-middleware'

const log = debug('nonce-tx-middleware')

/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 */
export class CachedNonceTxMiddleware implements ITxMiddlewareHandler {
  private _publicKey: Uint8Array
  private _client: Client
  private _lastNonce: number | null

  constructor(publicKey: Uint8Array, client: Client) {
    this._publicKey = publicKey
    this._client = client
    this._lastNonce = null
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (this._lastNonce === null) {
      log('Nonce not found getting from loomchain')
      try {
        const key = bytesToHex(this._publicKey)
        this._lastNonce = await this._client.getNonceAsync(key)
      } catch (err) {
        throw Error('Failed to obtain latest nonce')
      }
    }

    this._lastNonce++
    log(`Next nonce ${this._lastNonce}`)

    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(this._lastNonce)
    return tx.serializeBinary()
  }

  HandleResults(results: ITxResults): ITxResults {
    const { validation, commit } = results
    const isCheckTxNonceInvalid =
      validation &&
      validation.code === 1 &&
      (validation.log && validation.log.indexOf('sequence number does not match') !== -1)
    const isDeliverTxNonceInvalid =
      commit &&
      commit.code === 1 &&
      (commit.log && commit.log.indexOf('sequence number does not match') !== -1)

    if (isCheckTxNonceInvalid || isDeliverTxNonceInvalid) {
      this._lastNonce = null
      throw new Error(INVALID_TX_NONCE_ERROR)
    }
    return results
  }
}
