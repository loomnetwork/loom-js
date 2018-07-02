import rlp from 'rlp'
import BN from 'bn.js'

import { Address, LocalAddress } from '../address'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'
import { bufferToProtobufBytes, bytesToHex } from '../crypto-utils'
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

  sigBytes?: Uint8Array
  proofBytes?: Uint8Array

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
    this.sigBytes = params.sig
    this.proofBytes = params.proof
  }

  rlpEncode(): string {
    const data = [
      this.slot.toArrayLike(Buffer as any, 'be') as Buffer,
      this.prevBlockNum.toNumber(), // TODO: this won't be sufficient to encode the entire range of uint64
      this.denomination.toNumber(),
      this.newOwner
    ]
    return '0x' + rlp.encode(data).toString('hex')
  }

  /**
   * Hex encoded signature of the tx, prefixed by "0x".
   */
  get sig(): string {
    return '0x' + (this.sigBytes ? bytesToHex(this.sigBytes) : '')
  }

  /**
   * Hex encoded merkle proof of the tx, prefixed by "0x".
   */
  get proof(): string {
    return '0x' + (this.proofBytes ? bytesToHex(this.proofBytes) : '')
  }

  /**
   * Hex encoded hash of the tx, prefixed by "0x".
   */
  get hash(): string {
    if (this.prevBlockNum.cmp(new BN(0)) === 0) {
      return soliditySha3({ type: 'uint64', value: this.slot })
    }
    return soliditySha3({ type: 'bytes', value: this.rlpEncode() })
  }

  /**
   * Signs the tx.
   * @param signer Signer to use for signing the tx.
   */
  async signAsync(signer: Web3Signer) {
    this.sigBytes = await signer.signAsync(this.hash)
  }
}

export function unmarshalPlasmaTxPB(rawTx: PlasmaTx): PlasmaCashTx {
  const tx = new PlasmaCashTx({
    slot: new BN(rawTx.getSlot()),
    prevBlockNum: unmarshalBigUIntPB(rawTx.getPreviousBlock()!),
    denomination: unmarshalBigUIntPB(rawTx.getDenomination()!),
    newOwner: Address.UmarshalPB(rawTx.getNewOwner()!).local.toString(),
    sig: rawTx.getSignature_asU8(),
    proof: rawTx.getProof_asU8()
  })
  return tx
}

export function marshalPlasmaTxPB(tx: PlasmaCashTx): PlasmaTx {
  const owner = new Address('eth', LocalAddress.fromHexString(tx.newOwner))
  const pb = new PlasmaTx()
  // TODO: protoc TypeScript plugin does't seem to understand annotations in .proto so the type
  // definition is wrong for the slot, it's actually a string that represents a 64-bit number...
  // should fix the plugin or use a different one.
  pb.setSlot(tx.slot.toString(10) as any)
  pb.setPreviousBlock(marshalBigUIntPB(tx.prevBlockNum))
  pb.setDenomination(marshalBigUIntPB(tx.denomination))
  pb.setNewOwner(owner.MarshalPB())
  if (tx.sigBytes) {
    pb.setSignature(bufferToProtobufBytes(tx.sigBytes))
  }
  if (tx.proofBytes) {
    pb.setProof(bufferToProtobufBytes(tx.proofBytes))
  }
  return pb
}
