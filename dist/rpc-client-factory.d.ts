import { JSONRPCProtocol, IJSONRPCClient } from './internal/json-rpc-client';
export interface IJSONRPCProtocolOptions {
    url: string;
    reconnectInterval?: number;
    maxReconnects?: number;
}
/**
 * Creates an RPC client for communicating with a Loom DAppChain based on the specified options.
 * @param opts Options object
 * @param opts.protocols
 * @param opts.autoConnect If `true` the client will automatically connect after being created,
 *                         defaults to `true` and shouldn't be changed.
 * @param opts.requestTimeout Maximum number of milliseconds the client should wait for a request
 *                            to receive a response.
 * @param opts.generateRequestId Can be set to override the default JSON-RPC message ID generator.
 */
export declare function createJSONRPCClient(opts: {
    protocols: IJSONRPCProtocolOptions[];
    autoConnect?: boolean;
    requestTimeout?: number;
    generateRequestId?: (method: string, params: object | any[]) => string;
}): IJSONRPCClient;
export declare function selectProtocol(url: string): JSONRPCProtocol;
