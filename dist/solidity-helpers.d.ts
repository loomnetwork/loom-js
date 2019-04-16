import Web3 from 'web3';
import { ethers } from 'ethers';
export declare function soliditySha3(...values: any[]): string;
/**
 * Signs messages using an Ethereum private key.
 */
export interface IEthereumSigner {
    signAsync(msg: string): Promise<Uint8Array>;
}
/**
 * Returns the Metamask signer from web3 current provider
 */
export declare function getMetamaskSigner(provider: any): ethers.Signer;
/**
 * Returns json rpc signer, ex: http://localhost:8545
 *
 * @param urlString url string to connect to provider
 * @param accountIndex index of the account on providers list
 */
export declare function getJsonRPCSignerAsync(urlString: string, accountIndex?: number): Promise<ethers.Signer>;
/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
export declare class EthersSigner implements IEthereumSigner {
    private _signer;
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    constructor(signer: ethers.Signer);
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    signAsync(msg: string): Promise<Uint8Array>;
}
/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
export declare class Web3Signer implements IEthereumSigner {
    private _web3;
    private _address;
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    constructor(web3: Web3, accountAddress: string);
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    signAsync(msg: string): Promise<Uint8Array>;
}
/**
 * THIS IS BEING DEPRECATED
 * Signs message using a Web3 account.
 * This signer should be used for signing in NodeJS.
 */
export declare class OfflineWeb3Signer implements IEthereumSigner {
    private _web3;
    private _account;
    /**
     * @param web3 Web3 instance to use for signing.
     * @param account Web3 account to sign with.
     */
    constructor(web3: Web3, account: any);
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    signAsync(msg: string): Promise<Uint8Array>;
}
