import { Address } from '../address';
import { ITxMiddlewareHandler, Client, ITxResults } from '../client';
export declare const INVALID_TX_NONCE_ERROR = "Invalid tx nonce";
export declare function isInvalidTxNonceError(err: any): boolean;
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the latest nonce from the chain for each tx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export declare class NonceTxMiddleware implements ITxMiddlewareHandler {
    private _publicKey;
    private _account;
    private _client;
    constructor(publicKey: Uint8Array, client: Client);
    constructor(account: Address, client: Client);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
    HandleResults(results: ITxResults): ITxResults;
}
