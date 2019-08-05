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
    const msgBuf = Buffer.from(msg, 'hex')
    const sig = ethutil.ecsign(msgBuf, privKeyBuf)
    let mode = 4 // Binance sign
    return Buffer.concat([ethutil.toBuffer(mode) as Buffer, sig.r, sig.s, ethutil.toBuffer(sig.v) as Buffer])
  }

  async getAddress(): Promise<string> {
    return this._address
  }
}