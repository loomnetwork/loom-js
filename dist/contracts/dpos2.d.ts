import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
export declare enum DelegationState {
    BONDING = 0,
    BONDED = 1,
    UNBONDING = 2
}
export interface ICandidate {
    pubKey: Uint8Array;
    address: Address;
    fee: BN;
    name: string;
    description: string;
    website: string;
}
export interface IValidator {
    address: Address;
    pubKey: Uint8Array;
    upblockCount: number;
    blockCount: number;
    slashPct: BN;
    distributionTotal: BN;
    delegationTotal: BN;
}
export interface IDelegation {
    validator: Address;
    delegator: Address;
    height: BN;
    amount: BN;
    updateAmount: BN;
    lockTime: number;
    state: DelegationState;
}
export declare class DPOS2 extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<DPOS2>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    getCandidatesAsync(): Promise<Array<ICandidate>>;
    getValidatorsAsync(): Promise<Array<IValidator>>;
    checkDelegationAsync(validator: Address, delegator: Address): Promise<IDelegation | null>;
    claimDistributionAsync(withdrawalAddress: Address): Promise<void>;
    registerCandidateAsync(pubKey: string, fee: BN, name: string, description: string, website: string): Promise<void>;
    unregisterCandidateAsync(): Promise<void>;
    delegateAsync(validator: Address, amount: BN): Promise<void>;
    unbondAsync(validator: Address, amount: BN | number | string): Promise<void>;
    electAsync(): Promise<void>;
}
