import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
export declare class Coin extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<Coin>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    getTotalSupplyAsync(): Promise<BN>;
    getBalanceOfAsync(owner: Address): Promise<BN>;
    getAllowanceAsync(owner: Address, spender: Address): Promise<BN>;
    approveAsync(spender: Address, amount: BN): Promise<void>;
    transferAsync(to: Address, amount: BN): Promise<void>;
    transferFromAsync(from: Address, to: Address, amount: BN): Promise<void>;
}
