import { Message } from 'google-protobuf';
import EventEmitter from 'events';
import retry from 'retry';
import { VMType } from './proto/loom_pb';
import { EvmTxReceipt, EvmTxObject, EthBlockInfo, EthBlockHashList, EthFilterLogList, EthTxHashList } from './proto/evm_pb';
import { Address } from './address';
import { IJSONRPCClient } from './internal/json-rpc-client';
export interface ITxHandlerResult {
    code?: number;
    log?: string;
    data?: string;
}
interface IBroadcastTxCommitResult {
    check_tx: ITxHandlerResult;
    deliver_tx: ITxHandlerResult;
    hash: string;
    height?: string;
}
export interface ITxBroadcastResult extends ITxHandlerResult {
    hash: string;
}
export interface ITxResults {
    validation: ITxHandlerResult;
    commit: ITxHandlerResult;
}
/**
 * Middleware handlers are expected to transform the tx data and check tx results.
 * Handlers should not modify the original input data in any way.
 */
export interface ITxMiddlewareHandler {
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
    handleError?(err: any): void;
    HandleResults?(results: ITxResults): ITxResults;
}
export declare enum ClientEvent {
    /**
     * Emitted when an event is received from a smart contract.
     * Listener will receive IChainEventArgs.
     */
    Contract = "contractEvent",
    /**
     * Exclusively used by loom-provider
     */
    EVMEvent = "evmEvent",
    /**
     * Emitted when an error occurs that can't be relayed by other means.
     * Listener will receive IClientErrorEventArgs.
     */
    Error = "error",
    /**
     * Emitted when a connection is established to the DAppChain.
     * Listener will receive INetEventArgs.
     */
    Connected = "connected",
    /**
     * Emitted when a connection with the DAppChain is closed.
     * Listener will receive INetEventArgs.
     */
    Disconnected = "disconnected"
}
export interface IClientEventArgs {
    kind: ClientEvent;
    /** URL that corresponds to the RPC client this event originated from. */
    url: string;
}
/**
 * Event that's emitted when some kind of error occurs that can't be relayed by other means,
 * e.g. socket error that occurs while listening for RPC events.
 */
export interface IClientErrorEventArgs extends IClientEventArgs {
    kind: ClientEvent.Error;
    /** May contain additional information in case of an RPC error. */
    error?: any;
}
/** Generic event containing data emitted by smart contracts. */
export interface IChainEventArgs extends IClientEventArgs {
    /** Identifier (currently only used by EVM events). */
    id: string;
    kind: ClientEvent.Contract | ClientEvent.EVMEvent;
    /** Address of the contract that emitted the event. */
    contractAddress: Address;
    /** Address of the caller that caused the event to be emitted. */
    callerAddress: Address;
    /** The block containing the tx that caused this event to be emitted. */
    blockHeight: string;
    /**
     * Data that was actually emitted by the smart contract,
     * the format and structure is defined by that contract.
     */
    data: Uint8Array;
    /** Hash that identifies the uniqueness of the transaction */
    transactionHash: string;
    /** Same as transactionHash in bytes */
    transactionHashBytes: Uint8Array;
    /** Topics subscribed on events */
    topics: Array<string>;
}
export declare const TX_ALREADY_EXISTS_ERROR = "Tx already exists in cache";
export declare function isTxAlreadyInCacheError(err: any): boolean;
export interface ITxBroadcaster {
    broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult>;
}
export declare class TxCommitBroadcaster implements ITxBroadcaster {
    broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult>;
}
export declare class TxSyncBroadcaster implements ITxBroadcaster {
    resultPollingStrategy: retry.OperationOptions;
    broadcast(client: IJSONRPCClient, txBytes: Uint8Array): Promise<IBroadcastTxCommitResult>;
}
/**
 * Writes to & reads from a Loom DAppChain.
 *
 * The client can listen to events emitted by smart contracts running on a DAppChain,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(client: Client) {
 *   client.on(ClientEvent.Contract, (event: IChainEventArgs) => {
 *     // handle event
 *   }
 * }
 */
export declare class Client extends EventEmitter {
    readonly chainId: string;
    private _writeClient;
    private _readClient;
    /** Broadcaster to use to send txs & receive results. */
    txBroadcaster: ITxBroadcaster;
    /** Middleware to apply to transactions before they are transmitted to the DAppChain. */
    txMiddleware: ITxMiddlewareHandler[];
    readonly readUrl: string;
    readonly writeUrl: string;
    /**
     * Constructs a new client to read & write data from/to a Loom DAppChain via web sockets.
     * @param chainId DAppChain identifier.
     * @param writeUrl Host & port to send txs, specified as "<protocol>://<host>:<port>".
     * @param readUrl Host & port of the DAppChain read/query interface, this should only be provided
     *                if it's not the same as `writeUrl`.
     */
    constructor(chainId: string, writeUrl: string, readUrl?: string);
    /**
     * Constructs a new client to read & write data from/to a Loom DAppChain.
     * @param chainId DAppChain identifier.
     * @param writeClient RPC client to use to send txs to the DAppChain.
     * @param readClient RPC client to use to query the DAppChain and listen to DAppChain events, this
     *                   should only be provided if it's not the same as `writeClient`.
     */
    constructor(chainId: string, writeClient: IJSONRPCClient, readClient?: IJSONRPCClient);
    /**
     * Cleans up all underlying network resources.
     * Once disconnected the client can no longer be used to interact with the DAppChain.
     */
    disconnect(): void;
    /**
     * Commits a transaction to the DAppChain.
     *
     * Consider using Contract.callAsync() instead.
     *
     * @param tx Transaction to commit.
     * @param opts Options object.
     * @param opts.middleware Middleware to apply before sending the tx to the DAppChain, setting this
     *                        option will override the default set of middleware specified in
     *                        the `Client.txMiddleware` property.
     * @returns Result (if any) returned by the tx handler in the contract that processed the tx.
     */
    commitTxAsync<T extends Message>(tx: T, opts?: {
        middleware?: ITxMiddlewareHandler[];
    }): Promise<Uint8Array | void>;
    /**
     * addListenerForTopics
     */
    addListenerForTopics(): Promise<void>;
    /**
     * Queries the current state of a contract.
     *
     * Consider using Contract.staticCallAsync() instead.
     */
    queryAsync(contract: Address, query?: Uint8Array, vmType?: VMType, caller?: Address): Promise<Uint8Array | void>;
    /**
     * Queries the receipt corresponding to a transaction hash
     *
     * @param txHash Transaction hash returned by call transaction.
     * @return EvmTxReceipt The corresponding transaction receipt.
     */
    getEvmTxReceiptAsync(txHash: Uint8Array): Promise<EvmTxReceipt | null>;
    /**
     * Returns the information about a transaction requested by transaction hash
     *
     * @param txHash Transaction hash returned by call transaction.
     * @return EvmTxObject The corresponding transaction object data.
     */
    getEvmTxByHashAsync(txHash: Uint8Array): Promise<EvmTxObject | null>;
    /**
     * Queries the code corresponding to a contract
     *
     * @param contractAddress Contract address returned by deploy.
     * @return Uint8Array The corresponding contract code
     */
    getEvmCodeAsync(contractAddress: Address): Promise<Uint8Array | null>;
    /**
     * Queries logs with filter terms
     *
     * @param filter Filter terms
     * @return Uint8Array The corresponding result of the filter
     */
    getEvmLogsAsync(filterObject: Object): Promise<Uint8Array | null>;
    /**
     * Creates a new filter based on filter terms, to notify when the state changes
     *
     * The function getEVMNewFilterAsync works in the similar way of the RPC call eth_newFilter, for more
     *
     * Also for understand how filters works check https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
     *
     * @param filter Filter terms
     * @return Uint8Array The corresponding result of the filter
     */
    newEvmFilterAsync(filterObject: Object): Promise<string | null>;
    /**
     * Polling method for a filter, which returns an array of logs which occurred since last poll
     *
     * The ID used was requested from getEVMNewFilterChanges or getEVMNewBlockFilter
     *
     * @param id Id of filter previously created
     * @return Uint8Array The corresponding result of the request for given id
     */
    getEvmFilterChangesAsync(id: string): Promise<EthBlockHashList | EthFilterLogList | EthTxHashList | null>;
    /**
     * Creates a filter in the node, to notify when a new block arrives
     *
     * In order to check if the state has changed, call getEVMFilterChangesAsync
     *
     * @return String Filter ID in hex format to be used later with getEVMFilterChangesAsync
     */
    newBlockEvmFilterAsync(): Promise<string | null>;
    /**
     * Creates a filter in the node, to notify when new pending transactions arrive.
     *
     * In order to check if the state has changed, call getEVMFilterChangesAsync
     *
     * @return String Filter ID in hex format to be used later with getEVMFilterChangesAsync
     */
    newPendingTransactionEvmFilterAsync(): Promise<string | null>;
    /**
     * Uninstall/delete previously created filters
     *
     * The ID used was requested from getEVMNewFilterChanges or getEVMNewBlockFilter
     *
     * @param id Id of filter previously created
     * @return boolean If true the filter is removed with success
     */
    uninstallEvmFilterAsync(id: string): Promise<boolean | null>;
    /**
     * Returns information about a block by block number.
     *
     * @param num Integer of a block number
     * @param full If true it returns the full transaction objects, if false only the hashes of the transactions
     */
    getEvmBlockByNumberAsync(num: string, full?: boolean): Promise<EthBlockInfo | null>;
    /**
     * Returns the information about a transaction requested by transaction hash.
     *
     * @param hash String with the hash of the transaction
     * @param full If true it returns the full transaction objects, if false only the hashes of the transactions
     */
    getEvmBlockByHashAsync(hashHexStr: string, full?: boolean): Promise<EthBlockInfo | null>;
    /**
     * It works by subscribing to particular events. The node will return a subscription id.
     * For each event that matches the subscription a notification with relevant data is send
     * together with the subscription id.
     *
     * Possible methods:
     *  * "NewHeads": Fires a notification each time a new header is appended to the chain
     *  * "Logs": Returns logs that are included in new imported blocks and match the given filter criteria
     *
     * Example of a "filter" (JSON String) with method "logs":
     *  {
     *    "address": "0xa520fe7702b96808f7bbc0d4a233ed1468216cfd",
     *    "topics": ["0x238a0cb8bb633d06981248b822e7bd33c2a35a6089241d099fa519e361cab902"]
     *  }
     *
     * @param method Method selected to the filter, can be "newHeads" or "logs"
     * @param filter JSON string of the filter
     */
    evmSubscribeAsync(method: string, filterObject: Object): Promise<string>;
    /**
     * Subscriptions are cancelled method and the subscription id as first parameter.
     * It returns a bool indicating if the subscription was cancelled successful.
     *
     * @param id Id of subscription previously created
     * @return boolean If true the subscription is removed with success
     */
    evmUnsubscribeAsync(id: string): Promise<boolean>;
    /**
     * Gets the number of the latest block
     *
     * @return The block height
     */
    getBlockHeightAsync(): Promise<number>;
    /**
     * Gets a nonce for the account identified by the given public key.
     *
     * This should only be called by middleware.
     *
     * @param key A hex encoded public key.
     * @return The nonce.
     */
    getNonceAsync(key: string): Promise<number>;
    /**
     * Gets a nonce for the account identified by the given public key or address.
     *
     * Only the key or the account needs to be provided, if both are provided the key is ignored.
     * This should only be called by middleware.
     *
     * @param key A hex encoded public key.
     * @parma account Account address prefixed by the chain ID, in the form chainID:0xdeadbeef
     * @return The nonce.
     */
    getAccountNonceAsync(params: {
        key?: string;
        account?: string;
    }): Promise<number>;
    /**
     * Tries to resolve a contract name to an address.
     *
     * @param contractName Name of a smart contract on a Loom DAppChain.
     * @returns Contract address, or null if a contract matching the given name wasn't found.
     */
    getContractAddressAsync(contractName: string): Promise<Address | null>;
    private _emitContractEvent;
    private _emitNetEvent;
}
export declare function overrideReadUrl(readUrl: string): string;
export {};
