import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
import { CandidateState, LocktimeTier, DelegationState } from '../proto/dposv3_pb';
export interface ICandidate {
    address: Address;
    pubKey: Uint8Array;
    delegationTotal: BN;
    slashPct: BN;
    whitelistAmount: BN;
    whitelistLocktimeTier: LocktimeTier;
    maxReferralPercentage?: number;
    fee: BN;
    newFee: BN;
    candidateState: CandidateState;
    name: string;
    description: string;
    website: string;
}
export interface IValidator {
    address: Address;
    pubKey: Uint8Array;
    slashPct: BN;
    delegationTotal: BN;
    whitelistAmount: BN;
    whitelistLocktimeTier: LocktimeTier;
}
export interface IDelegation {
    validator: Address;
    updateValidator?: Address;
    delegator: Address;
    index: number;
    amount: BN;
    updateAmount: BN;
    lockTime: number;
    lockTimeTier: number;
    state: DelegationState;
    referrer: string;
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
export declare class DPOS3 extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<DPOS3>;
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
    checkAllDelegationsAsync(delegator: Address): Promise<IDelegatorDelegations>;
    checkDelegationAsync(validator: Address, delegator: Address): Promise<IDelegatorDelegations | null>;
    registerCandidateAsync(pubKey: string, fee: BN, name: string, description: string, website: string, tier: LocktimeTier): Promise<void>;
    unregisterCandidateAsync(): Promise<void>;
    delegateAsync(validator: Address, amount: BN, tier: LocktimeTier, referrer?: string): Promise<void>;
    redelegateAsync(oldValidator: Address, validator: Address, amount: BN, index: number, referrer?: string): Promise<void>;
    consolidateDelegations(validator: Address): Promise<void>;
    unbondAsync(validator: Address, amount: BN | number | string, index: number): Promise<void>;
    private getDelegation;
}
