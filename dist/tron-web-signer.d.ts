import TronWeb from 'tronweb';
import { IEthereumSigner } from './solidity-helpers';
/**
 * Signs message using a TronWeb account.
 * This signer should be used for interactive signing in the browser with TronLink.
 */
export declare class TronWebSigner implements IEthereumSigner {
    private _tronWeb;
    private _address;
    /**
     * @param tronweb tronweb instance to use for signing.
     * @param accountAddress Address of tronweb account to sign with.
     */
    constructor(tronWeb: TronWeb, accountAddress: string);
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    signAsync(msg: string): Promise<Uint8Array>;
    /**
     * Returns signer address
     */
    getAddress(): Promise<string>;
}
