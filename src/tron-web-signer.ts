import ethutil from 'ethereumjs-util'
import TronWeb from 'tronweb'
import { IEthereumSigner } from './solidity-helpers'

/**
 * Signs message using a TronWeb account.
 * This signer should be used for interactive signing in the browser with TronLink.
 */
export class TronWebSigner implements IEthereumSigner {
  private _tronWeb: TronWeb
  private _address: string

  /**
   * @param tronweb tronweb instance to use for signing.
   * @param accountAddress Address of tronweb account to sign with.
   */
  constructor(tronWeb: TronWeb, accountAddress: string) {
    this._tronWeb = tronWeb
    this._address = accountAddress
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    const signature = await this._tronWeb.trx.sign(msg)
    const sig = signature.slice(2)

    let mode = 3 // TRX sign
    const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
    const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
    let v = parseInt(sig.substring(128, 130), 16)

    if (v === 0 || v === 1) {
      v += 27
    } 
    
    return Buffer.concat([ethutil.toBuffer(mode) as Buffer, r, s, ethutil.toBuffer(v) as Buffer])
  }

  /**
   * Returns signer address
   */
  async getAddress(): Promise<string> {
    return this._address
  }
}
