import debug from 'debug'
import { TronWebSigner } from '../tron'

import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { EthersSigner, soliditySha3 } from '../solidity-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-trx-tx-middleware')

/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export class SignedTrxTxMiddleware implements ITxMiddlewareHandler {
  signer: TronWebSigner
  signerAddress?: string

  /**
   * @param signer ethers.js signer to use for signing txs.
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
