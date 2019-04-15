import debug from 'debug'
import { ethers } from 'ethers'

import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { ISignerAsync, ScatterSigner, soliditySha3 } from '../sign-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-eos-tx-middleware')

/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export class SignedEosTxMiddleware implements ITxMiddlewareHandler {
  private _signer: ISignerAsync
  private _signerAddress?: string

  constructor(signer: ISignerAsync, signerAddress: string) {
    this._signer = signer
    this._signerAddress = signerAddress
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    const sig = await this._signer.signAsync(bytesToHex(txData))
    console.log('signer', bytesToHex(sig))

    log(`signer: ${this._signerAddress}, signature: 0x${bytesToHex(sig)}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)

    return signedTx.serializeBinary()
  }
}
