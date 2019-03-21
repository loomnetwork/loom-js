import retry from 'retry';
import { Client, ITxMiddlewareHandler } from './client';
export interface IEthReceipt {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from?: string;
    to?: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    contractAddress: string;
    logs: Array<any>;
    logsBloom?: string;
    root?: string;
    status: string;
}
export interface IEthTransaction {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    v?: string;
    r?: string;
    s?: string;
}
export interface IEthBlock {
    number: string | null;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    receiptsRoot: string;
    miner: string;
    difficulty: string;
    totalDifficulty: string;
    extraData: string;
    size: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    transactions: Array<IEthTransaction | string>;
    uncles: Array<string>;
}
export interface IEthPubSubNewHeads {
    jsonrpc: '2.0';
    method: 'eth_subscription';
    params: {
        subscription: string;
        result: {
            difficulty: string;
            extraData: string;
            gasLimit: string;
            gasUsed: string;
            logsBloom: string;
            miner: string;
            nonce: string;
            number: string;
            parentHash: string;
            receiptRoot: string;
            sha3Uncles: string;
            timestamp: string;
            transactionsRoot: string;
        };
    };
}
export interface IEthPubLogs {
    jsonrpc: '2.0';
    method: 'eth_subscription';
    params: {
        subscription: string;
        result: {
            address: string;
            blockHash: string;
            blockNumber: string;
            data: string;
            logIndex: string;
            topics: Array<string>;
            transactionHash: string;
            transactionIndex: string;
        };
    };
}
export interface IEthFilterLog {
    removed: boolean;
    logIndex: string;
    transactionIndex: string;
    transactionHash: string;
    blockHash: string;
    blockNumber: string;
    address: string;
    data: string;
    topics: Array<string>;
    blockTime: string;
}
export interface IEthRPCPayload {
    id: number;
    method: string;
    params: Array<any>;
}
export declare type SetupMiddlewareFunction = (client: Client, privateKey: Uint8Array) => ITxMiddlewareHandler[];
export declare type EthRPCMethod = (payload: IEthRPCPayload) => any;
/**
 * Web3 provider that interacts with EVM contracts deployed on Loom DAppChains.
 */
export declare class LoomProvider {
    private _client;
    private _subscribed;
    private _accountMiddlewares;
    private _setupMiddlewares;
    private _netVersionFromChainId;
    private _ethRPCMethods;
    protected notificationCallbacks: Array<Function>;
    readonly accounts: Map<string, Uint8Array>;
    /**
     * Strict mode true remove any param on JSON RPC that isn't compliant with the
     * official Ethereum RPC docs https://en.ethereum.wiki/json-rpc
     */
    private _strict;
    /**
     * The retry strategy that should be used to retry some web3 requests.
     * By default failed requested won't be resent.
     * To understand how to tweak the retry strategy see
     * https://github.com/tim-kos/node-retry#retrytimeoutsoptions
     */
    retryStrategy: retry.OperationOptions;
    /**
     * Constructs the LoomProvider to bridges communication between Web3 and Loom DappChains
     *
     * @param client Client from LoomJS
     * @param privateKey Account private key
     */
    constructor(client: Client, privateKey: Uint8Array, setupMiddlewaresFunction?: SetupMiddlewareFunction);
    /**
     * Creates new accounts by passing the private key array
     *
     * Accounts will be available on public properties accounts
     *
     * @param accountsPrivateKey Array of private keys to create new accounts
     */
    addAccounts(accountsPrivateKey: Array<Uint8Array>): void;
    /**
    * Setter to the strict mode
    */
    strict: boolean;
    on(type: string, callback: any): void;
    addDefaultEvents(): void;
    addDefaultMethods(): void;
    /**
     * Adds custom methods to the provider when a particular method isn't supported
     *
     * Throws if the added method already exists
     *
     * @param method name of the method to be added
     * @param customMethodFn function that will implement the method
     */
    addCustomMethod(method: string, customMethodFn: EthRPCMethod): void;
    /**
     * Overwrites existing method on the provider
     *
     * Throws if the overwritten method doesn't exists
     *
     * @param method name of the method to be overwritten
     * @param customMethodFn function that will implement the method
     */
    overwriteMethod(method: string, customMethodFn: EthRPCMethod): void;
    /**
     * Return the numerical representation of the ChainId
     * More details at: https://github.com/loomnetwork/loom-js/issues/110
     */
    static chainIdToNetVersion(chainId: string): number;
    removeListener(type: string, callback: (...args: any[]) => void): void;
    removeAllListeners(type: string, callback: Function): void;
    reset(): void;
    disconnect(): void;
    sendAsync(payload: any, callback?: Function): Promise<any | void>;
    /**
     * Should be used to make async request
     * This method is used internally by web3, so we adapt it to be used with loom contract
     * when we are wrapping the evm on a DAppChain
     * @param payload JSON payload generated by web3 which will be translated to loom transaction/call
     * @param callback Triggered on end with (err, result)
     */
    send(payload: any, callback: Function): Promise<void>;
    private _ethAccounts;
    private _ethBlockNumber;
    private _ethCall;
    private _ethEstimateGas;
    private _ethGetBalance;
    private _ethGasPrice;
    private _ethGetBlockByHash;
    private _ethGetBlockByNumber;
    private _ethGetCode;
    private _ethGetFilterChanges;
    private _ethGetLogs;
    private _ethGetTransactionByHash;
    private _ethGetTransactionReceipt;
    private _ethNewBlockFilter;
    private _ethNewFilter;
    private _ethNewPendingTransactionFilter;
    private _ethSendTransaction;
    private _ethSign;
    private _ethSubscribe;
    private _ethUninstallFilter;
    private _ethUnsubscribe;
    private _netVersion;
    private _deployAsync;
    private _callAsync;
    private _callStaticAsync;
    private _createBlockInfo;
    private _createTransactionResult;
    private _createReceiptResult;
    private _getTransaction;
    private _createLogResult;
    private _getLogs;
    private _onWebSocketMessage;
    private _commitTransaction;
    private _okResponse;
}
