import { ITxMiddlewareHandler, Client, ITxResults } from '../client';
import { Address } from '../address';
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 */
export declare class CachedNonceTxMiddleware implements ITxMiddlewareHandler {
    private _publicKey;
    private _account;
    private _client;
    private _lastNonce;
    constructor(publicKey: Uint8Array, client: Client);
    constructor(account: Address, client: Client);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
    HandleResults(results: ITxResults): ITxResults;
    handleError(err: any): void;
}
