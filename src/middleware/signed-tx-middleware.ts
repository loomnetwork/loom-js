import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { sign, publicKeyFromPrivateKey } from '../crypto-utils'

/**
 * Signs transactions.
 */
export class SignedTxMiddleware implements ITxMiddlewareHandler {
  // The private key that should be used to sign txs.
  privateKey: Uint8Array

  /**
   * Creates middlware that signs txs with the given key.
   * @param privateKey The private key that should be used to sign txs.
   */
  constructor(privateKey: Uint8Array) {
    this.privateKey = privateKey
  }

  Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const sig = sign(txData as Uint8Array, this.privateKey)
    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    signedTx.setPublicKey(publicKeyFromPrivateKey(this.privateKey))
    return Promise.resolve(signedTx.serializeBinary())
  }
}
