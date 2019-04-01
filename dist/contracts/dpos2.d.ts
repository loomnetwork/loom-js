import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
export declare enum DelegationState {
    BONDING = 0,
    BONDED = 1,
    UNBONDING = 2,
    REDELEGATING = 3
}
export declare enum LockTimeTier {
    Tier0 = 0,
    Tier1 = 1,
    Tier2 = 2,
    Tier3 = 3
}
export interface ICandidate {
    pubKey: Uint8Array;
    address: Address;
    fee: BN;
    newFee: BN;
    feeDelayCounter: BN;
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
    whitelistAmount: BN;
    whitelistLockTime: BN;
}
export interface IDelegation {
    validator: Address;
    updateValidator?: Address;
    delegator: Address;
    height: BN;
    amount: BN;
    updateAmount: BN;
    lockTime: number;
    lockTimeTier: number;
    state: DelegationState;
}
export interface ITotalDelegation {
    amount: BN;
    weightedAmount: BN;
}
export interface ICandidateDelegations {
    delegationTotal: BN;
    delegationsArray: Array<IDelegation>;
}
export interface IDelegatorDelegations {
    amount: BN;
    weightedAmount: BN;
    delegationsArray: Array<IDelegation>;
}
export declare class DPOS2 extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<DPOS2>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    getTimeUntilElectionAsync(): Promise<BN>;
    getCandidatesAsync(): Promise<Array<ICandidate>>;
    getValidatorsAsync(): Promise<Array<IValidator>>;
    getDelegations(candidate: Address): Promise<ICandidateDelegations>;
    getAllDelegations(): Promise<Array<ICandidateDelegations>>;
    checkDelegatorDelegations(delegator: Address): Promise<IDelegatorDelegations>;
    checkDistributionAsync(owner: Address): Promise<BN>;
    totalDelegationAsync(delegator: Address): Promise<ITotalDelegation | null>;
    checkDelegationAsync(validator: Address, delegator: Address): Promise<IDelegation | null>;
    claimDistributionAsync(withdrawalAddress: Address): Promise<void>;
    registerCandidateAsync(pubKey: string, fee: BN, name: string, description: string, website: string, tier: LockTimeTier): Promise<void>;
    unregisterCandidateAsync(): Promise<void>;
    delegateAsync(validator: Address, amount: BN, tier: LockTimeTier, referrer?: string): Promise<void>;
    redelegateAsync(oldValidator: Address, validator: Address, amount: BN, referrer?: string): Promise<void>;
    unbondAsync(validator: Address, amount: BN | number | string): Promise<void>;
    private getDelegation;
}
