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
}

export function unmarshalPlasmaBlockPB(block: PlasmaBlock): PlasmaCashBlock {
  const txs = block.getTransactionsList().map(tx => unmarshalPlasmaTxPB(tx))
  // TODO: verify the merkle root
  return new PlasmaCashBlock({ txs, merkleHash: block.getMerkleHash_asU8() })
}
