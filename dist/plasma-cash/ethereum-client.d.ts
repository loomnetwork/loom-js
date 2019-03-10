import BN from 'bn.js';
import Web3 from 'web3';
import { PlasmaCashTx } from './plasma-cash-tx';
import { ethers } from 'ethers';
export declare enum PlasmaCoinMode {
    ETH = 0,
    ERC20 = 1,
    ERC721 = 2
}
export declare enum PlasmaCoinState {
    Deposited = 0,
    Exiting = 1,
    Exited = 2
}
export interface IPlasmaCoin {
    slot: BN;
    /** Identifier of an ERC721 token. */
    uid: BN;
    /** Plasma block number at which this coin was deposited. */
    depositBlockNum: BN;
    denomination: BN;
    /** Hex encoded Ethereum address of the current owner of the coin, prefixed by 0x. */
    owner: string;
    /** The coin's state */
    state: PlasmaCoinState;
    /** the coin type */
    mode: PlasmaCoinMode;
    /** Hex encoded Ethereum address of the token contract, prefixed by 0x. */
    contractAddress: string;
}
export interface IPlasmaExitData {
    /** Identifier of a coin's exit. */
    slot: BN;
    /** Owner of the coin's exit. */
    owner: String;
    /** Plasma block number at which the exit's parent transaction was included. */
    prevBlock: BN;
    /** Plasma block number at which the exit's transaction was included. */
    exitBlock: BN;
    state: PlasmaCoinState;
    timestamp: BN;
}
export interface IPlasmaChallenge {
    slot: BN;
    txHash: string;
}
export declare function marshalChallengeEvent(data: {
    slot: string;
    txHash: string;
}): IPlasmaChallenge;
export interface IPlasmaDeposit {
    slot: BN;
    blockNumber: BN;
    denomination: BN;
    from: string;
    contractAddress: string;
}
export declare function marshalDepositEvent(data: {
    slot: string;
    blockNumber: string;
    denomination: string;
    from: string;
    contractAddress: string;
}): IPlasmaDeposit;
export interface ISendTxOptions {
    /** Address of sender (hex-encoded, prefixed by 0x) */
    from: string;
    /** Max gas to use for a tx (gas limit) */
    gas?: number | string;
    /** Gas price (in Wei) to use for a tx */
    gasPrice?: string;
}
export interface IPlasmaExitParams extends ISendTxOptions {
    slot: BN;
    exitTx: PlasmaCashTx;
    exitBlockNum: BN;
    prevTx?: PlasmaCashTx;
    prevBlockNum?: BN;
}
export interface IPlasmaFinalizeExitsParams extends ISendTxOptions {
    slots: BN[];
}
export interface IPlasmaCancelExitsParams extends ISendTxOptions {
    slots: BN[];
}
export interface IPlasmaFinalizeExitParams extends ISendTxOptions {
    slot: BN;
}
export interface IPlasmaCancelExitParams extends ISendTxOptions {
    slot: BN;
}
export interface IPlasmaWithdrawParams extends ISendTxOptions {
    slot: BN;
}
export interface IPlasmaChallengeParams extends ISendTxOptions {
    slot: BN;
    challengingBlockNum: BN;
    challengingTx: PlasmaCashTx;
}
export interface IPlasmaChallengeBeforeParams extends ISendTxOptions {
    slot: BN;
    challengingTx: PlasmaCashTx;
    challengingBlockNum: BN;
    prevTx?: PlasmaCashTx;
    prevBlockNum?: BN;
}
export interface IPlasmaRspondChallengeBeforeParams extends ISendTxOptions {
    slot: BN;
    challengingTxHash: string;
    respondingBlockNum: BN;
    respondingTx: PlasmaCashTx;
}
export declare class EthereumPlasmaClient {
    private _ethers;
    private _web3;
    private _plasmaContract;
    private _plasmaEventListener;
    /**
     * Web3 contract instance of the Plasma Cash contract on Ethereum.
     */
    readonly plasmaCashContract: ethers.Contract;
    /**
     * Web3 contract instance of the Plasma Cash contract linked to a wss enabled endpoint for listening to events
     */
    readonly plasmaEvents: any;
    readonly web3: Web3;
    constructor(_ethers: ethers.Signer, plasmaContractAddr: string, eventsEndpoint: string);
    getExitAsync(params: {
        slot: BN;
        from: string;
    }): Promise<IPlasmaExitData>;
    checkMembershipAsync(params: {
        leaf: string;
        root: string;
        slot: BN;
        proof: string;
        from: string;
    }): Promise<boolean>;
    getBlockRootAsync(params: {
        blockNumber: BN;
        from: string;
    }): Promise<string>;
    getPlasmaCoinAsync(params: {
        slot: BN;
        from: string;
    }): Promise<IPlasmaCoin>;
    /**
     * @returns Web3 tx receipt object.
     */
    startExitAsync(params: IPlasmaExitParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    cancelExitAsync(params: IPlasmaCancelExitParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    cancelExitsAsync(params: IPlasmaCancelExitsParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    finalizeExitAsync(params: IPlasmaFinalizeExitParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    finalizeExitsAsync(params: IPlasmaFinalizeExitsParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    withdrawAsync(params: IPlasmaWithdrawParams): Promise<ethers.ContractTransaction>;
    /**
     *
     * @returns Web3 tx receipt object.
     */
    withdrawBondsAsync(params: ISendTxOptions): Promise<ethers.ContractTransaction>;
    /**
     * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    challengeAfterAsync(params: IPlasmaChallengeParams): Promise<ethers.ContractTransaction>;
    /**
     * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    challengeBetweenAsync(params: IPlasmaChallengeParams): Promise<ethers.ContractTransaction>;
    /**
     * `Invalid History Challenge`: Challenge a coin with invalid history.
     *
     * @returns Web3 tx receipt object.
     */
    challengeBeforeAsync(params: IPlasmaChallengeBeforeParams): Promise<ethers.ContractTransaction>;
    /**
     * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
     *
     * @returns Web3 tx receipt object.
     */
    respondChallengeBeforeAsync(params: IPlasmaRspondChallengeBeforeParams): Promise<ethers.ContractTransaction>;
    marshalDepositEvent(log: ethers.providers.Log): IPlasmaDeposit;
}
