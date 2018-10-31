import { JSONRPCProtocol } from './json-rpc-client';
import { WSRPCClient } from './ws-rpc-client';
/**
 * Sends JSON-RPC messages via HTTP or WebSocket, and listens to events via WebSocket.
 */
export declare class DualRPCClient extends WSRPCClient {
    private _http;
    private _protocol;
    /**
     * @param opts.httpUrl HTTP URL to send requests to.
     * @param opts.wsUrl WebSocket URL to connect to.
     * @param opts.protocol Primary protocol to use to send requests, defaults to HTTP.
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     */
    constructor(opts: {
        httpUrl: string;
        wsUrl: string;
        autoConnect?: boolean;
        protocol?: JSONRPCProtocol;
        requestTimeout?: number;
        reconnectInterval?: number;
        maxReconnects?: number;
        generateRequestId?: (method: string, params: object | any[]) => string;
    });
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    sendAsync<T>(method: string, params: object | any[]): Promise<T>;
}
