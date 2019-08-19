import { ITxMiddlewareHandler, Client, ITxResults } from '../client';
import { Address } from '../address';
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 *
 * The CachedNonceTxMiddleware waits for a tx to be commited before incrementing the cached nonce,
 * while the SpeculativeNonceTxMiddleware increments the cached nonce before the tx is even
 * sent to the chain - which makes it possible for a caller to rapidly submit a bunch of txs.
 */
export declare class SpeculativeNonceTxMiddleware implements ITxMiddlewareHandler {
    private _publicKey;
    private _account;
    private _client;
    private _lastNonce;
    private _fetchNoncePromise;
    constructor(publicKey: Uint8Array, client: Client);
    constructor(account: Address, client: Client);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
    HandleResults(results: ITxResults): ITxResults;
    handleError(err: any): void;
    private _updateLastNonce;
    private _fetchNonce;
}
