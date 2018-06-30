import rlp from 'rlp'
import BN from 'bn.js'

import { Address, LocalAddress } from '../address'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'
import { bufferToProtobufBytes } from '../crypto-utils'
import { soliditySha3, Web3Signer } from './solidity-helpers'
import { PlasmaTx } from '../proto/plasma_cash_pb'

export class PlasmaCashTx {
  slot: BN
  prevBlockNum: BN
  denomination: BN
  /**
   * Hex-encoded Ethereum address of the new owner of the Plasma token.
   */
  newOwner: string
  /**
   * Signature bytes.
   */
  sig?: Uint8Array
  proof?: Uint8Array

  constructor(params: {
    slot: BN
    prevBlockNum: BN
    denomination: BN | number
    newOwner: string
    sig?: Uint8Array
    proof?: Uint8Array
  }) {
    this.slot = params.slot
    this.prevBlockNum = params.prevBlockNum
    this.denomination = new BN(params.denomination)
    this.newOwner = params.newOwner
    this.sig = params.sig
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
   * Signs the tx.
   * @param signer Signer to use for signing the tx.
   */
  async signAsync(signer: Web3Signer) {
    this.sig = await signer.signAsync(this.hash)
  }
}

export function unmarshalPlasmaTxPB(rawTx: PlasmaTx): PlasmaCashTx {
  const tx = new PlasmaCashTx({
    slot: new BN(rawTx.getSlot()),
    prevBlockNum: unmarshalBigUIntPB(rawTx.getPreviousBlock_asU8()),
    denomination: unmarshalBigUIntPB(rawTx.getDenomination_asU8()),
    newOwner: Address.UmarshalPB(rawTx.getNewOwner()!).local.toString(),
    proof: rawTx.getProof_asU8()
  })
  return tx
}

export function marshalPlasmaTxPB(tx: PlasmaCashTx): PlasmaTx {
  const owner = new Address('eth', LocalAddress.fromHexString(tx.newOwner))
  const pb = new PlasmaTx()
  pb.setSlot(tx.slot.toNumber())
  pb.setPreviousBlock(marshalBigUIntPB(tx.prevBlockNum))
  pb.setDenomination(marshalBigUIntPB(tx.denomination))
  pb.setNewOwner(owner.MarshalPB())
  if (tx.sig) {
    pb.setSignature(bufferToProtobufBytes(tx.sig))
  }
  if (tx.proof) {
    pb.setProof(bufferToProtobufBytes(tx.proof))
  }
  return pb
}
