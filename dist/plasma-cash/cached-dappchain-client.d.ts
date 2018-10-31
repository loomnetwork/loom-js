import { DAppChainPlasmaClient } from './dappchain-client';
import { Client, Address, PlasmaDB, PlasmaCashTx } from '..';
import BN from 'bn.js';
export declare class CachedDAppChainPlasmaClient extends DAppChainPlasmaClient {
    private _database;
    constructor(params: {
        dAppClient: Client;
        callerAddress: Address;
        database: PlasmaDB;
        contractName?: string;
    });
    getPlasmaTxAsync(slot: BN, blockNum: BN): Promise<PlasmaCashTx>;
    getAllCoins(): BN[];
}
