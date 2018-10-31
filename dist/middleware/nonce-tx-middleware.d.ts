import { ITxMiddlewareHandler, Client } from '../client';
/**
 * Wraps data in a NonceTx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export declare class NonceTxMiddleware implements ITxMiddlewareHandler {
    private _publicKey;
    private _client;
    constructor(publicKey: Uint8Array, client: Client);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
}
