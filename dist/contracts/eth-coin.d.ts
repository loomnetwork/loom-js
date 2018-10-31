import { Coin } from './coin';
import { Client } from '../client';
import { Address } from '../address';
export declare class EthCoin extends Coin {
    static createAsync(client: Client, callerAddr: Address): Promise<EthCoin>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
}
