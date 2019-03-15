import debug from 'debug'
import { NonceTx, Transaction, MessageTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client, ITxResults } from '../client'
import { Address } from '../address'

const log = debug('nonce2-tx-middleware')

export const INVALID_TX_NONCE_ERROR = 'Invalid tx nonce'

export function isInvalidTxNonceError(err: any): boolean {
  return err instanceof Error && err.message === INVALID_TX_NONCE_ERROR
}

export enum AccountType {
  /**
   * The account isn't mapped
   */
  Local = '1',

  /**
   * The account from sender is mapped than use this option
   */
  Foreign = '2'
}

/**
 * Wraps data in a NonceTx.
 * This middleware obtains the latest nonce from the chain for each tx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export class Nonce2TxMiddleware implements ITxMiddlewareHandler {
  private _client: Client
  private _accountType: AccountType
  private _fromAddress: Address

  /**
   *
   * @param fromAddress
   * @param client
   * @param accountType
   */
  constructor(fromAddress: Address, client: Client, accountType: AccountType = AccountType.Local) {
    this._fromAddress = fromAddress
    this._client = client
    this._accountType = accountType
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const nonce = await this._client.getNonce2Async(
      this._fromAddress.chainId,
      this._fromAddress.local.toString(),
      this._accountType as string
    )

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
