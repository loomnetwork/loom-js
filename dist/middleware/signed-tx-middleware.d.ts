import { ITxMiddlewareHandler } from '../client';
/**
 * Signs transactions.
 */
export declare class SignedTxMiddleware implements ITxMiddlewareHandler {
    privateKey: Uint8Array;
    /**
     * Creates middlware that signs txs with the given key.
     * @param privateKey The private key that should be used to sign txs.
     */
    constructor(privateKey: Uint8Array);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
}
