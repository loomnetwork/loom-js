import debug from 'debug'

import { Address } from '../address'
import { ITxMiddlewareHandler, Client, ITxResults } from '../client'
import { bytesToHex } from '../crypto-utils'
import { NonceTx } from '../proto/loom_pb'

const log = debug('nonce-tx-middleware')

export const INVALID_TX_NONCE_ERROR = 'Invalid tx nonce'

export function isInvalidTxNonceError(err: any): boolean {
  return err instanceof Error && err.message === INVALID_TX_NONCE_ERROR
}

/**
 * Wraps data in a NonceTx.
 * This middleware obtains the latest nonce from the chain for each tx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export class NonceTxMiddleware implements ITxMiddlewareHandler {
  private _publicKey: Uint8Array | null = null
  private _account: Address | null = null
  private _client: Client

  constructor(publicKeyOrAccount: Uint8Array | Address, client: Client) {
    if (publicKeyOrAccount instanceof Address) {
      this._account = publicKeyOrAccount
    } else {
      this._publicKey = publicKeyOrAccount
    }
    this._client = client
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const key = this._publicKey ? bytesToHex(this._publicKey) : undefined
    const account = this._account ? this._account.toString() : undefined
    const nonce = await this._client.getAccountNonceAsync({ key, account })

    console.log('account', this._account)

    log(`Next nonce ${nonce + 1}`)

    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(nonce + 1)
    return tx.serializeBinary()
  }

  HandleResults(results: ITxResults): ITxResults {
    const { validation, commit } = results
    if (
      validation &&
      validation.code === 1 &&
      (validation.log && validation.log.indexOf('sequence number does not match') !== -1)
    ) {
      throw new Error(INVALID_TX_NONCE_ERROR)
    }
    if (
      commit &&
      commit.code === 1 &&
      (commit.log && commit.log.indexOf('sequence number does not match') !== -1)
    ) {
      throw new Error(INVALID_TX_NONCE_ERROR)
    }
    return results
  }
}
