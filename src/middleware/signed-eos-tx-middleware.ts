import debug from 'debug'
import { ethers } from 'ethers'

import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { ISigner, ISignerAsync, ScatterSigner, soliditySha3 } from '../sign-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-eth-tx-middleware')

/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export class SignedEosTxMiddleware implements ITxMiddlewareHandler {
  private _signer: ISigner | ISignerAsync
  private _signerAddress?: string

  constructor(signer: ISignerAsync | ISigner) {
    this._signer = signer
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    console.log('data')
    // if (!this.signerAddress) {
    //   // Getting the public key address
    //   this.signerAddress = await this.signer.getAddress()
    // }
    //
    // // Get hash to be signed
    // const hash = soliditySha3({
    //   type: 'bytes',
    //   value: bytesToHex(txData)
    // })
    //
    // // Signing the transaction
    // const ScatterSigner = new ScatterSigner(this.signer)
    // const sig = await ScatterSigner.signAsync(hash)
    //
    // log(`signer: ${this.signerAddress}, signature: 0x${bytesToHex(sig.slice(1))}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    // signedTx.setSignature(sig)
    // NOTE: don't need to send secp256k1 public key sig since it can be recovered from hash + sig

    return signedTx.serializeBinary()
  }
}
