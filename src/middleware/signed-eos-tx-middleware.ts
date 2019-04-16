import debug from 'debug'
import { ethers } from 'ethers'

import { NonceTx, SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { OfflineScatterEosSign, ScatterSigner, soliditySha3 } from '../sign-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-eos-tx-middleware')

/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export class SignedEosTxMiddleware implements ITxMiddlewareHandler {
  private _signer: OfflineScatterEosSign
  private _signerAddress?: string

  constructor(signer: OfflineScatterEosSign, signerAddress: string) {
    this._signer = signer
    this._signerAddress = signerAddress
  }

  getNonce(txData: Readonly<Uint8Array>) {
    const tx = NonceTx.deserializeBinary(txData as Uint8Array)
    return tx.getSequence()
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const txDataHex = bytesToHex(txData)
    this._signer.nonce = `${this.getNonce(txData)}`
    const sig = await this._signer.signAsync(txDataHex)

    log(`signer: ${this._signerAddress}, signature: ${sig}`, sig)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)

    return signedTx.serializeBinary()
  }
}
