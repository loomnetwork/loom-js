import { ethers } from 'ethers'
import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { EthersSigner, soliditySha3 } from '../solidity-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'

/**
 * Signs transactions using Eth crypto primitives
 */
export class SignedEthTxMiddleware implements ITxMiddlewareHandler {
  signer: ethers.Signer
  ethAddress!: string

  constructor(signer: ethers.Signer) {
    this.signer = signer
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this.ethAddress) {
      // Getting the public key address
      this.ethAddress = await this.signer.getAddress()
    }

    // Hashing the public address required
    const hash = soliditySha3({
      type: 'address',
      value: this.ethAddress
    })

    // Signing the transaction
    const etherSigner = new EthersSigner(this.signer)
    const sig = await etherSigner.signAsync(hash)

    // Remove the first unused byte on sig
    const publicKey = ethers.utils.recoverPublicKey(
      ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(hash))),
      `0x${bytesToHex(sig.slice(1))}`
    )

    // Check if we're generating the right public key
    if (ethers.utils.computeAddress(publicKey) !== this.ethAddress) {
      throw Error("Public key generated isn't valid")
    }

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)

    // Remove the first unused byte of the signature
    signedTx.setSignature(sig)
    signedTx.setPublicKey(hexToBytes(publicKey))
    signedTx.setChainname('eth')
    return Promise.resolve(signedTx.serializeBinary())
  }
}
