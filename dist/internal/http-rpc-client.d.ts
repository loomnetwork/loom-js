import EventEmitter from 'events';
import { IJSONRPCClient } from './json-rpc-client';
/**
 * Sends JSON-RPC messages via HTTP.
 * Doesn't support listening to DAppChain events at the moment.
 */
export declare class HTTPRPCClient extends EventEmitter implements IJSONRPCClient {
    url: string;
    private _rpcId;
    private _getNextRequestId;
    requestTimeout: number;
    readonly isSubscribed: boolean;
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     */
    constructor(url: string, opts?: {
        requestTimeout?: number;
        generateRequestId?: (method: string, params: object | any[]) => string;
    });
    disconnect(): void;
    ensureConnectionAsync(): Promise<void>;
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    sendAsync<T>(method: string, params: object | any[]): Promise<T>;
}
