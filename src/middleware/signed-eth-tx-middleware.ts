import debug from 'debug'
import { ethers } from 'ethers'

import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { EthersSigner, soliditySha3 } from '../solidity-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-eth-tx-middleware')

/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export class SignedEthTxMiddleware implements ITxMiddlewareHandler {
  signer: ethers.Signer
  fromAddress!: string

  /**
   * @param signer ethers.js signer to use for signing txs.
   */
  constructor(signer: ethers.Signer) {
    this.signer = signer
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this.fromAddress) {
      // Getting the public key address
      this.fromAddress = await this.signer.getAddress()
    }

    // Get hash to be signed
    const hash = soliditySha3({
      type: 'bytes',
      value: bytesToHex(txData)
    })

    // Signing the transaction
    const etherSigner = new EthersSigner(this.signer)
    const sig = await etherSigner.signAsync(hash)

    log('Signature without first byte', `0x${bytesToHex(sig.slice(1))}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    // NOTE: don't need to send secp256k1 public key sig since it can be recovered from hash + sig

    return signedTx.serializeBinary()
  }
}
