import { ITxMiddlewareHandler, Client, ITxResults, AccountType } from '../client';
import { Address } from '../address';
export declare const INVALID_TX_NONCE_ERROR = "Invalid tx nonce";
export declare function isInvalidTxNonceError(err: any): boolean;
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the latest nonce from the chain for each tx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
export declare class Nonce2TxMiddleware implements ITxMiddlewareHandler {
    private _client;
    private _accountType;
    private _fromAddress;
    /**
     *
     * @param fromAddress
     * @param client
     * @param accountType
     */
    constructor(fromAddress: Address, client: Client, accountType?: AccountType);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
    HandleResults(results: ITxResults): ITxResults;
}
