import BN from 'bn.js'

import { PlasmaCashTx, unmarshalPlasmaTxPB } from './plasma-cash-tx'
import { PlasmaBlock } from '../proto/plasma_cash_pb'

export class PlasmaCashBlock {
  private _txs: PlasmaCashTx[]

  merkleHash: Uint8Array

  constructor(params: { txs: PlasmaCashTx[]; merkleHash: Uint8Array }) {
    const { txs, merkleHash } = params
    this._txs = txs
    this.merkleHash = merkleHash
  }

  get txs(): ReadonlyArray<PlasmaCashTx> {
    return this._txs
  }

  /**
   * Finds a tx referencing the given slot.
   * @param slot 64-bit uint identifier of a UTXO.
   */
  findTxWithSlot(slot: BN): PlasmaCashTx {
    for (let i = 0; i < this._txs.length; i++) {
      if (this._txs[i].slot.cmp(slot) === 0) {
        return this._txs[i]
      }
    }
    return new PlasmaCashTx({
      slot: new BN(0),
      prevBlockNum: new BN(0),
      denomination: new BN(0),
      newOwner: '0x0'
    })
  }
}

export function unmarshalPlasmaBlockPB(block: PlasmaBlock): PlasmaCashBlock {
  const txs = block.getTransactionsList().map(tx => unmarshalPlasmaTxPB(tx))
  // TODO: verify the merkle root
  return new PlasmaCashBlock({ txs, merkleHash: block.getMerkleHash_asU8() })
}
