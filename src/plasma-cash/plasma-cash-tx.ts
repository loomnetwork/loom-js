import rlp from 'rlp'
import BN from 'bn.js'

import { soliditySha3, signMessageAsync } from './solidity-helpers'

export class PlasmaCashTx {
  slot: BN
  prevBlockNum: BN
  denomination: BN
  /**
   * Hex-encoded Ethereum address of the new owner of the Plasma token.
   */
  newOwner: string
  /**
   * Signature bytes, will only be set if sign() has been called successfully.
   */
  sig?: Uint8Array
  proof?: Uint8Array

  constructor(params: {
    slot: BN
    prevBlockNum: BN
    denomination: BN | number
    newOwner: string
    proof?: Uint8Array
  }) {
    this.slot = params.slot
    this.prevBlockNum = params.prevBlockNum
    this.denomination = new BN(params.denomination)
    this.newOwner = params.newOwner
    this.proof = params.proof
  }

  /**
   * Hex encoded hash of the tx, prefixed by "0x".
   */
  get hash(): string {
    if (this.prevBlockNum.cmp(new BN(0)) === 0) {
      return soliditySha3({ type: 'uint64', value: this.slot })
    }
    const data = [
      this.slot.toArrayLike(Buffer as any, 'be') as Buffer,
      this.prevBlockNum.toNumber(), // TODO: this won't be sufficient to encode the entire range of uint64
      this.denomination.toNumber(),
      this.newOwner
    ]
    return soliditySha3({ type: 'bytes', value: '0x' + rlp.encode(data).toString('hex') })
  }

  /**
   * Signs the tx using a web3 account.
   * @param account web3 account to sign with.
   */
  async signAsync(account: any) {
    this.sig = await signMessageAsync(account, this.hash)
  }
}
