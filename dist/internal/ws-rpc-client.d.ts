import { EventEmitter } from 'events';
import { IJSONRPCError } from './json-rpc-client';
export interface IEventData {
    caller: {
        chain_id: string;
        local: string;
    };
    address: {
        chain_id: string;
        local: string;
    };
    block_height: string;
    encoded_body: string;
    tx_hash: string;
    topics: Array<string>;
}
export interface IJSONRPCEvent {
    id: string;
    error?: IJSONRPCError;
    result?: IEventData;
}
/**
 * Sends JSON-RPC messages via web sockets.
 */
export declare class WSRPCClient extends EventEmitter {
    url: string;
    private _client;
    private _isSubcribed;
    protected _rpcId: number;
    protected _getNextRequestId: () => string;
    requestTimeout: number;
    readonly isSubscribed: boolean;
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     * @param opts.reconnectInterval Number of milliseconds to wait before attempting to reconnect
     *                               (in case the connection drops out).
     * @param opts.maxReconnects Maximum number of times to reconnect, defaults to infinity.
     */
    constructor(url: string, opts?: {
        autoConnect?: boolean;
        requestTimeout?: number;
        reconnectInterval?: number;
        maxReconnects?: number;
        generateRequestId?: (method: string, params: object | any[]) => string;
    });
    /**
     * Gracefully closes the underlying web socket connection.
     */
    disconnect(): void;
    /**
     * Waits for a connection to be established to the server (if it isn't already).
     * @returns A promise that will be resolved when a connection is established.
     */
    ensureConnectionAsync(): Promise<void>;
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    sendAsync<T>(method: string, params: object | any[]): Promise<T>;
    private _onEventMessage;
}
