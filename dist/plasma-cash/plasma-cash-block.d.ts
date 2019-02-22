import BN from 'bn.js';
import { PlasmaCashTx } from './plasma-cash-tx';
import { PlasmaBlock } from '../proto/plasma_cash_pb';
export declare class PlasmaCashBlock {
    private _txs;
    merkleHash: Uint8Array;
    constructor(params: {
        txs: PlasmaCashTx[];
        merkleHash: Uint8Array;
    });
    readonly txs: ReadonlyArray<PlasmaCashTx>;
    /**
     * Finds a tx referencing the given slot.
     * @param slot 64-bit uint identifier of a UTXO.
     */
    findTxWithSlot(slot: BN): PlasmaCashTx;
}
export declare function unmarshalPlasmaBlockPB(block: PlasmaBlock): PlasmaCashBlock;
