import { IEthereumSigner } from './solidity-helpers'
import ethutil from 'ethereumjs-util'
const { crypto } = require('@binance-chain/javascript-sdk')
/**
 * Signs message using a Binance account.
 * This signer should be used for interactive signing in the browser.
 */
export class BinanceSigner implements IEthereumSigner { 
  private _privateKey: string
  private _address: string

  constructor(privateKey: string) {
    this._privateKey = privateKey
    const address = crypto.getAddressFromPrivateKey(privateKey)
    const decod = crypto.decodeAddress(address)
    const binanceAddressHex = '0x' + decod.toString("hex")
    this._address = binanceAddressHex
  }

  async signAsync(msg: string): Promise<Uint8Array> {
    const privKeyBuf = Buffer.from(this._privateKey, "hex")
    const signature = crypto.generateSignature(msg.toString(), privKeyBuf)
    const sig = signature.toString("hex").slice(2)

    let mode = 3 // Binance sign
    const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
    const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
    let v = parseInt(sig.substring(128, 130), 16)

    if (v === 0 || v === 1) {
      v += 27
    }

    return Buffer.concat([ethutil.toBuffer(mode) as Buffer, r, s, ethutil.toBuffer(v) as Buffer])
  }

  async getAddress(): Promise<string> {
    return this._address
  }
}