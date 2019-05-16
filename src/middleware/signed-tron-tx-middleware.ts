import debug from 'debug'
import { TronWebSigner } from '../tron-web-signer'

import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { soliditySha3 } from '../solidity-helpers'
import { bytesToHex } from '../crypto-utils'

const log = debug('signed-tron-tx-middleware')

/**
 * Signs transactions using a TRON compatible (secp256k1) private key.
 */
export class SignedTronTxMiddleware implements ITxMiddlewareHandler {
  signer: TronWebSigner
  signerAddress?: string

  /**
   * @param signer tronweb signer to use for signing txs.
   */
  constructor(signer: TronWebSigner) {
    this.signer = signer
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this.signerAddress) {
      // Getting the public key address
      this.signerAddress = await this.signer.getAddress()
    }

    // Get hash to be signed
    const hash = soliditySha3({
      type: 'bytes',
      value: bytesToHex(txData)
    })

    // Signing the transaction
    const sig = await this.signer.signAsync(hash)

    log(`signer: ${this.signerAddress}, signature: 0x${bytesToHex(sig.slice(1))}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    // NOTE: don't need to send secp256k1 public key sig since it can be recovered from hash + sig

    return signedTx.serializeBinary()
  }
}
