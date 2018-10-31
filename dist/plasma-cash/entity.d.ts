import BN from 'bn.js';
import Web3 from 'web3';
import { EthereumPlasmaClient, IPlasmaCoin, IPlasmaDeposit, IPlasmaExitData } from './ethereum-client';
import { DAppChainPlasmaClient } from './dappchain-client';
import { PlasmaCashTx } from './plasma-cash-tx';
import { Account } from 'web3/eth/accounts';
import { PlasmaDB } from './db';
export interface IProofs {
    inclusion: {
        [blockNumber: string]: string;
    };
    exclusion: {
        [blockNumber: string]: string;
    };
    transactions: {
        [blockNumber: string]: PlasmaCashTx;
    };
}
export interface IEntityParams {
    /** Web3 account for use on Ethereum */
    ethAccount: Account;
    ethPlasmaClient: EthereumPlasmaClient;
    dAppPlasmaClient: DAppChainPlasmaClient;
    /** Allows to override the amount of gas used when sending txs to Ethereum. */
    defaultGas?: string | number;
    childBlockInterval: number;
}
export interface IWeb3EventSub {
    unsubscribe(callback?: (error: Error, result: boolean) => void): void;
}
/**
 * Manages Plasma Cash related interactions between an Ethereum network (Ganache, Mainnet, etc.)
 * and a Loom DAppChain from the point of view of a single entity. An entity has two identities, one
 * on Ethereum, and one on the DAppChain, each identity has its own private/public key pair.
 */
export declare class Entity {
    private _web3;
    private _ethAccount;
    private _dAppPlasmaClient;
    private _ethPlasmaClient;
    private _defaultGas?;
    private _childBlockInterval;
    private _exitWatchers;
    private _challengeWatchers;
    readonly web3: Web3;
    readonly database: PlasmaDB;
    readonly ethAddress: string;
    readonly ethAccount: Account;
    readonly plasmaCashContract: any;
    readonly contractName: any;
    constructor(web3: Web3, params: IEntityParams);
    refreshAsync(): Promise<void>;
    checkHistoryAsync(coin: IPlasmaCoin): Promise<boolean>;
    transferTokenAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        denomination: BN | number;
        newOwner: string;
    }): Promise<void>;
    getPlasmaTxAsync(slot: BN, blockNumber: BN): Promise<PlasmaCashTx>;
    getExitAsync(slot: BN): Promise<IPlasmaExitData>;
    getCurrentBlockAsync(): Promise<BN>;
    getPlasmaCoinAsync(slot: BN): Promise<IPlasmaCoin>;
    getBlockRootAsync(blockNumber: BN): Promise<string>;
    getUserCoinsAsync(): Promise<IPlasmaCoin[]>;
    checkMembershipAsync(leaf: string, root: string, slot: BN, proof: string): Promise<boolean>;
    submitPlasmaBlockAsync(): Promise<BN>;
    submitPlasmaDepositAsync(deposit: IPlasmaDeposit): Promise<void>;
    startExitAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        exitBlockNum: BN;
    }): Promise<object>;
    finalizeExitsAsync(): Promise<object>;
    finalizeExitAsync(slot: BN): Promise<any>;
    /**
     * @return Web3 subscription object that can be passed to stopWatching().
     */
    watchExit(slot: BN, fromBlock: BN): IWeb3EventSub;
    /**
     * @return Web3 subscription object that can be passed to stopWatching().
     */
    watchChallenge(slot: BN, fromBlock: BN): IWeb3EventSub;
    challengeExitAsync(slot: BN, owner: String): Promise<void>;
    respondChallengeAsync(slot: BN, txHash: string, challengingBlockNum: BN): Promise<void>;
    getCoinHistoryAsync(slot: BN, blockNumbers: BN[]): Promise<IProofs>;
    verifyCoinHistoryAsync(slot: BN, proofs: IProofs): Promise<boolean>;
    checkExclusionAsync(root: string, slot: BN, proof: string): Promise<boolean>;
    checkInclusionAsync(tx: PlasmaCashTx, root: string, slot: BN, proof: string): Promise<boolean>;
    getDepositEvents(fromBlock?: BN, all?: boolean): Promise<IPlasmaDeposit[]>;
    getBlockNumbersAsync(startBlock: any): Promise<BN[]>;
    protected nextNonDepositBlock(startBlock: any): BN;
    stopWatching(slot: BN): void;
    withdrawAsync(slot: BN): Promise<void>;
    withdrawBondsAsync(): Promise<object>;
    challengeAfterAsync(params: {
        slot: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    challengeBetweenAsync(params: {
        slot: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    challengeBeforeAsync(params: {
        slot: BN;
        prevBlockNum: BN;
        challengingBlockNum: BN;
    }): Promise<object>;
    sendETH(to: string, value: BN, gas?: number): Promise<any>;
    respondChallengeBeforeAsync(params: {
        slot: BN;
        challengingTxHash: string;
        respondingBlockNum: BN;
    }): Promise<object>;
    /**
     * Retrieves the Plasma coin created by a deposit tx.
     * Throws an error if the given tx receipt doesn't contain a Plasma deposit event.
     *
     * @param tx The transaction that we want to decode.
     */
    getCoinFromTxAsync(tx: any): Promise<IPlasmaCoin>;
    prefix(slot: BN): string;
}
