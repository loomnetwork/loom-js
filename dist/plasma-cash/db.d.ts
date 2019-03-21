import { PlasmaCashTx } from './plasma-cash-tx';
import BN from 'bn.js';
export interface IDatabaseCoin {
    slot: BN;
    blockNumber: BN;
    included: boolean;
    tx: PlasmaCashTx;
}
export declare class PlasmaDB {
    dbPath: string;
    db: any;
    constructor(dbPath?: string);
    receiveCoin(coinId: BN, block: BN, included: boolean, tx: PlasmaCashTx): void;
    saveLastBlock(block: BN): void;
    getLastBlock(): BN;
    saveBlock(coinId: BN, block: BN): void;
    getBlock(coinId: BN): BN;
    getTx(coinId: BN, block: BN): PlasmaCashTx;
    exists(coinId: BN, block: BN): Boolean;
    removeCoin(coinId: BN): void;
    getCoin(coinId: BN): IDatabaseCoin[];
    getAllCoins(): any;
    getAllCoinSlots(): BN[];
    marshalDBCoin(c: any): IDatabaseCoin;
    /** Reclaims any space used by the database */
    delete(): void;
}
