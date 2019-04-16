import ethutil from 'ethereumjs-util'
import Web3 from 'web3'
import { ethers } from 'ethers'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import ecc from 'eosjs-ecc'

const web3 = new Web3()

export function soliditySha3(...values: any[]): string {
  return (web3.utils.soliditySha3 as any)(...values)
}

/**
 * Signs messages using private key async
 */
export interface ISignerAsync {
  signAsync(msg: string): Promise<Uint8Array>
}

/**
 * Returns the Metamask signer from web3 current provider
 */
export function getMetamaskSigner(provider: any): ethers.Signer {
  // HACK: force personal sign by pretending to be metamask no matter what the web3 provider is
  provider.isMetaMask = true
  return new ethers.providers.Web3Provider(provider).getSigner()
}

export async function getScatterSigner() {
  // const network = ScatterJS.Network.fromJson({
  //   blockchain: 'eos',
  //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  //   host: 'nodes.get-scatter.com',
  //   port: 443,
  //   protocol: 'https'
  // })
  //
  // ScatterJS.connect('LOOM-JS-E2E', { network }).then((connected: boolean) => {
  //   console.log('connected', connected)
  // })
  // ecc.randomKey().then((privateWif: any) =>  {
  //   const pubkey = ecc.privateToPublic(privateWif)
  //   console.log(pubkey)
  // })

  const privKey = await ecc.randomKey()
  const pubKey = ecc.privateToPublic(privKey)
  // console.log(privKey, pubKey)
}

/**
 * Returns json rpc signer, ex: http://localhost:8545
 *
 * @param urlString url string to connect to provider
 * @param accountIndex index of the account on providers list
 */
export async function getJsonRPCSignerAsync(
  urlString: string,
  accountIndex: number = 0
): Promise<ethers.Signer> {
  const provider = new ethers.providers.JsonRpcProvider(urlString)
  const signers = (await provider.listAccounts()).map((acc: any) => provider.getSigner(acc))
  return signers[accountIndex]
}

/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
export class EthersSigner implements ISignerAsync {
  private _signer: ethers.Signer

  /**
   * @param signer Signer to sign with.
   */
  constructor(signer: ethers.Signer) {
    this._signer = signer
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    let flatSig = await this._signer.signMessage(ethers.utils.arrayify(msg))
    const sig = ethers.utils.splitSignature(flatSig)
    let v = sig.v!
    if (v === 0 || v === 1) {
      v += 27
    }
    flatSig = '0x01' + sig.r.slice(2) + sig.s.slice(2) + v.toString(16)
    return ethutil.toBuffer(flatSig)
  }
}

/**
 * Abstract class for signing with Scatter
 */
export abstract class BaseScatterSigner implements ISignerAsync {
  protected _nonce: string = ''

  get nonce(): string {
    return this._nonce
  }

  set nonce(n: string) {
    this._nonce = n
  }

  abstract signAsync(msg: string): Promise<Uint8Array>
}

/**
 * Signs message using the Scatter from the ScatterJS
 * This signer needs to have the ScatterJS started and running
 */
export class ScatterSigner extends BaseScatterSigner {
  private _scatter: any
  private _publicKey: string

  constructor(scatter: any, publicKey: string) {
    super()
    this._scatter = scatter
    this._publicKey = publicKey
  }

  async signAsync(msg: string): Promise<Uint8Array> {
    if (this.nonce === '') {
      throw Error(`Nonce can't be empty`)
    }

    if (this._publicKey === '') {
      throw Error(`Public Key can't be empty`)
    }

    const tx = await this._scatter.authenticate(this.nonce, msg, this._publicKey)
    return Buffer.from(tx, 'hex')
  }
}

/**
 * Signs message using the Scatter internal way for EOS
 * This signer should be used for signing in NodeJS tests
 *
 * Based on Scatter authenticate method:
 * https://github.com/GetScatter/scatter-js/blob/master/mock-sites/vanilla-eos/index.html#L187
 */
export class OfflineScatterEosSign extends BaseScatterSigner{
  private _privateKey: string

  constructor (privateKey: string) {
    super()
    this._privateKey = privateKey
  }

  signAsync(msg: string): Promise<Uint8Array> {
    if (this.nonce === '') {
      throw Error(`Nonce can't be empty`)
    }

    const shaData = ecc.sha256(ecc.sha256(msg) + ecc.sha256(this._nonce))
    const sig = ecc.signHash(shaData, this._privateKey)
    return Promise.resolve(Buffer.from(sig))
  }
}

/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
export class Web3Signer implements ISignerAsync {
  private _web3: Web3
  private _address: string

  /**
   * @param web3 Web3 instance to use for signing.
   * @param accountAddress Address of web3 account to sign with.
   */
  constructor(web3: Web3, accountAddress: string) {
    this._web3 = web3
    this._address = accountAddress
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    const signature = await this._web3.eth.sign(msg, this._address)
    const sig = signature.slice(2)

    let mode = 1 // Geth
    const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
    const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
    let v = parseInt(sig.substring(128, 130), 16)

    if (v === 0 || v === 1) {
      v += 27
    } else {
      mode = 0 // indicate that msg wasn't prefixed before signing (MetaMask doesn't prefix!)
    }
    return Buffer.concat([ethutil.toBuffer(mode) as Buffer, r, s, ethutil.toBuffer(v) as Buffer])
  }
}

/**
 * THIS IS BEING DEPRECATED
 * Signs message using a Web3 account.
 * This signer should be used for signing in NodeJS.
 */
export class OfflineWeb3Signer implements ISignerAsync {
  private _web3: Web3
  private _account: any

  /**
   * @param web3 Web3 instance to use for signing.
   * @param account Web3 account to sign with.
   */
  constructor(web3: Web3, account: any) {
    this._web3 = web3
    this._account = account
  }

  /**
   * Signs a message.
   * @param msg Message to sign.
   * @returns Promise that will be resolved with the signature bytes.
   */
  async signAsync(msg: string): Promise<Uint8Array> {
    const ret = await this._web3.eth.accounts.sign(msg, this._account.privateKey)
    // @ts-ignore
    const sig = ret.signature.slice(2)

    let mode = 1 // Geth
    const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
    const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
    let v = parseInt(sig.substring(128, 130), 16)

    return Buffer.concat([ethutil.toBuffer(mode) as Buffer, r, s, ethutil.toBuffer(v) as Buffer])
  }
}
