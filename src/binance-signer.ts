import { SIGNATURE_TYPE } from './crypto-utils'
import { IEthereumSigner } from './solidity-helpers'
import ethutil from 'ethereumjs-util'
const { crypto } = require('@binance-chain/javascript-sdk')
/**
 * Signs message using a Binance account.
 * This signer should be used for interactive signing in the browser.
 */
export class BinanceSigner implements IEthereumSigner {
  private _privateKey: Buffer
  private _address: string

  constructor(privateKey: string) {
    this._privateKey = Buffer.from(privateKey, 'hex')
    const address = crypto.getAddressFromPrivateKey(privateKey)
    this._address = '0x' + crypto.decodeAddress(address).toString('hex')
  }

  async signAsync(msg: string): Promise<Uint8Array> {
    const msgHex = msg.includes('0x') ? msg : '0x' + msg
    const msgBuf = ethutil.sha256(msgHex)

    const sig = ethutil.ecsign(msgBuf, this._privateKey)

    return Buffer.concat([
      ethutil.toBuffer(SIGNATURE_TYPE.BINANCE) as Buffer,
      sig.r,
      sig.s,
      ethutil.toBuffer(sig.v) as Buffer
    ])
  }

  async getAddress(): Promise<string> {
    return this._address
  }
}
