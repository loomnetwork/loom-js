import ethutil from 'ethereumjs-util'
import Web3 from 'web3'
import { ethers } from 'ethers'

const web3 = new Web3()

export function soliditySha3(...values: any[]): string {
  return (web3.utils.soliditySha3 as any)(...values)
}

/**
 * Signs messages using an Ethereum private key.
 */
export interface IEthereumSigner {
  signAsync(msg: string): Promise<Uint8Array>
}

/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
export class Web3Signer implements IEthereumSigner {
  private _wallet: ethers.Signer

  /**
   * @param web3 Web3 instance to use for signing.
   * @param accountAddress Address of web3 account to sign with.
   */
  constructor(wallet: ethers.Signer) {
    this._wallet = wallet
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    let flatSig = await this._wallet.signMessage(ethers.utils.arrayify(msg))
    const sig = ethers.utils.splitSignature(flatSig)
    let v = sig.v!
    if (v === 0 || v === 1 ) {
        v += 27
    }
    flatSig = '0x01' + sig.r.slice(2) + sig.s.slice(2) + (v).toString(16)
    return ethutil.toBuffer(flatSig)
  }
}
