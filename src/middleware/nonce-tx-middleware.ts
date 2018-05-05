import { NonceTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler, Client } from '../client'
import { bytesToHex } from '../crypto-utils'

/**
 * Wraps data in a NonceTx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export class NonceTxMiddleware implements ITxMiddlewareHandler {
  private _publicKey: Uint8Array
  private _client: Client

  constructor(publicKey: Uint8Array, client: Client) {
    this._publicKey = publicKey
    this._client = client
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const key = bytesToHex(this._publicKey)
    const nonce = await this._client.getNonceAsync(key)
    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(nonce + 1)
    return tx.serializeBinary()
  }
}
