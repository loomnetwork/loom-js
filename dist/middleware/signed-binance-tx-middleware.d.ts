import { ITxMiddlewareHandler } from '../client';
import { BinanceSigner } from '../binance-signer';
/**
 * Signs transactions using an Binance compatible (secp256k1) private key.
 */
export declare class SignedBinanceTxMiddleware implements ITxMiddlewareHandler {
    signer: BinanceSigner;
    signerAddress?: string;
    /**
     * @param signer signer to use for signing txs.
     */
    constructor(signer: BinanceSigner);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
}
