import { IEthereumSigner } from './solidity-helpers';
/**
 * Signs message using a Binance account.
 * This signer should be used for interactive signing in the browser.
 */
export declare class BinanceSigner implements IEthereumSigner {
    private _privateKey;
    private _address;
    constructor(privateKey: string);
    signAsync(msg: string): Promise<Uint8Array>;
    getAddress(): Promise<string>;
}
