import debug from 'debug'
import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client, ITxResults, isTxAlreadyInCacheError } from '../client'
import { bytesToHex } from '../crypto-utils'
import { INVALID_TX_NONCE_ERROR } from './nonce-tx-middleware'

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
  private _publicKey: Uint8Array
  private _client: Client
  private _lastNonce: number

  constructor(publicKey: Uint8Array, client: Client) {
    this._publicKey = publicKey
    this._client = client
    this._lastNonce = -1
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (this._lastNonce === -1) {
      log('Nonce not cached')
      try {
        // TODO: make sure only one request is in flight at any time
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
      // TODO: start a timeout so nonce is requeried too soon
      log('Reset cached nonce due to dupe tx')
    }
  }
}
