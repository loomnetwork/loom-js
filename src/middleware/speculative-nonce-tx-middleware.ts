import debug from 'debug'
import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client, ITxResults, isTxAlreadyInCacheError } from '../client'
import { bytesToHex } from '../crypto-utils'
import { INVALID_TX_NONCE_ERROR } from './nonce-tx-middleware'
import { Address } from '../address'

const log = debug('speculative-nonce-tx-middleware')

/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 *
 * The CachedNonceTxMiddleware waits for a tx to be commited before incrementing the cached nonce,
 * while the SpeculativeNonceTxMiddleware increments the cached nonce before the tx is even
 * sent to the chain - which makes it possible for a caller to rapidly submit a bunch of txs.
 */
export class SpeculativeNonceTxMiddleware implements ITxMiddlewareHandler {
  private _publicKey: Uint8Array | null = null
  private _account: Address | null = null
  private _client: Client
  private _lastNonce: number
  private _fetchNoncePromise: Promise<void> | null

  constructor(publicKey: Uint8Array, client: Client)
  constructor(account: Address, client: Client)
  constructor(publicKeyOrAccount: Uint8Array | Address, client: Client) {
    if (publicKeyOrAccount instanceof Address) {
      this._account = publicKeyOrAccount
    } else {
      this._publicKey = publicKeyOrAccount
    }

    this._client = client
    this._lastNonce = -1
    this._fetchNoncePromise = null
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (this._lastNonce === -1) {
      log('Nonce not cached')
      await this._updateLastNonce()
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
    const isInvalidTx = validation && validation.code !== 0
    const isFailedTx = commit && commit.code
    if (isInvalidTx || isFailedTx) {
      // Nonce has to be reset regardless of the cause of the tx failure.
      log(`Reset cached nonce due to failed tx`)
      this._lastNonce = -1
      // Throw a specific error for a nonce mismatch
      const isCheckTxNonceInvalid =
        validation &&
        validation.code === 1 &&
        (validation.log && validation.log.indexOf('sequence number does not match') !== -1)
      const isDeliverTxNonceInvalid =
        commit &&
        commit.code === 1 &&
        (commit.log && commit.log.indexOf('sequence number does not match') !== -1)

      if (isCheckTxNonceInvalid || isDeliverTxNonceInvalid) {
        throw new Error(INVALID_TX_NONCE_ERROR)
      }
    }
    return results
  }

  handleError(err: any): void {
    if (isTxAlreadyInCacheError(err)) {
      // This error indicates the tx payload & nonce were identical to a previously sent tx,
      // which means the cached nonce has diverged from the nonce on the node, need to clear it out
      // so it's refetched for the next tx.
      this._lastNonce = -1
      // TODO: start a timeout so nonce isn't requeried too soon
      log('Reset cached nonce due to dupe tx')
    }
  }

  private async _updateLastNonce(): Promise<void> {
    // make sure only one request is in flight at any time
    if (this._fetchNoncePromise) {
      return this._fetchNoncePromise
    }
    this._fetchNoncePromise = this._fetchNonce()
    this._fetchNoncePromise
      .then(() => (this._fetchNoncePromise = null))
      .catch(() => (this._fetchNoncePromise = null))
    return this._fetchNoncePromise
  }

  private async _fetchNonce(): Promise<void> {
    try {
      log('Fetching nonce...')
      const key = this._publicKey ? bytesToHex(this._publicKey) : undefined
      const account = this._account ? this._account.toString() : undefined
      this._lastNonce = await this._client.getAccountNonceAsync({ key, account })
      log(`Fetched nonce ${this._lastNonce}`)
    } catch (err) {
      throw Error('Failed to obtain latest nonce')
    }
  }
}
