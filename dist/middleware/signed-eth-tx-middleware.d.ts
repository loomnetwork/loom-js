import { ethers } from 'ethers';
import { ITxMiddlewareHandler } from '../client';
/**
 * Signs transactions using an Ethereum compatible (secp256k1) private key.
 */
export declare class SignedEthTxMiddleware implements ITxMiddlewareHandler {
    signer: ethers.Signer;
    signerAddress?: string;
    /**
     * @param signer ethers.js signer to use for signing txs.
     */
    constructor(signer: ethers.Signer);
    Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>;
}
