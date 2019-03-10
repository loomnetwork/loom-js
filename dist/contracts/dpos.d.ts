import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
export interface ICandidate {
    address: Address;
    pubKey: Uint8Array;
}
export interface IWitness {
    pubKey: Uint8Array;
    voteTotal: BN;
    powerTotal: BN;
}
export declare class DPOS extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<DPOS>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    registerCandidateAsync(pubKey: Uint8Array): Promise<void>;
    unregisterCandidateAsync(): Promise<void>;
    voteAsync(candidateAddress: Address, amount: number): Promise<void>;
    electAsync(): Promise<void>;
    getCandidatesAsync(): Promise<Array<ICandidate> | null>;
    getWitnessesAsync(): Promise<Array<IWitness> | null>;
}
