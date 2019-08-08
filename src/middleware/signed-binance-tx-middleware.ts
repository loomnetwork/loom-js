import debug from 'debug'
import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { bytesToHex } from '../crypto-utils'
import { BinanceSigner } from '../binance-signer'
import { ethers } from 'ethers'

const log = debug('signed-binance-tx-middleware')

/**
 * Signs transactions using an Binance compatible (secp256k1) private key.
 */
export class SignedBinanceTxMiddleware implements ITxMiddlewareHandler {
  signer: BinanceSigner
  signerAddress?: string

  /**
   * @param signer signer to use for signing txs.
   */
  constructor(signer: BinanceSigner) {
    this.signer = signer
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this.signerAddress) {
      // Getting the public key address
      this.signerAddress = await this.signer.getAddress()
    }

    // Signing the transaction
    const sig = await this.signer.signAsync(bytesToHex(txData))

    log(`signer: ${this.signerAddress}, signature: 0x${bytesToHex(sig.slice(1))}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    // NOTE: don't need to send secp256k1 public key sig since it can be recovered from hash + sig

    return signedTx.serializeBinary()
  }
}
