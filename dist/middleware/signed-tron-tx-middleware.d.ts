import { TronWebSigner } from '../tron-web-signer';
import { ITxMiddlewareHandler } from '../client';
/**
 * Signs transactions using a TRON compatible (secp256k1) private key.
 */
export declare class SignedTronTxMiddleware implements ITxMiddlewareHandler {
    signer: TronWebSigner;
    signerAddress?: string;
    /**
     * @param signer tronweb signer to use for signing txs.
     */
    constructor(signer: TronWebSigner);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
}
