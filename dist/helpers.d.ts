import { Client, ITxMiddlewareHandler } from './client';
import BN from 'bn.js';
import { IJSONRPCClient } from './internal/json-rpc-client';
import { Address } from './address';
import { ethers } from 'ethers';
export interface IParsedSigsArray {
    vs: Array<number>;
    rs: Array<string>;
    ss: Array<string>;
    valIndexes: Array<number>;
}
export declare const ORACLE_SIG_SIZE_WITH_MODE = 134;
export declare const ORACLE_SIG_SIZE = 132;
/**
 * Given a list of signatures as a concatenated string, it splits the string in an array
 * of signatures, recovers the v/r/s values of each signature, and returns arrays of v, r, s triples
 * which are ordered based on the validators array which was passed in as an argument.
 * The returned values are to be passed as arguments to pass the multisignature check of the
 * functions of the Validator Manager Contract .
 *
 * @param sig Signature (prefixed or not) or list of concatenated signatures
 * @param hash The hash of the message that was s igned
 * @param validators The list of validators which signed on the message
 * @returns Sorted array of v/r/s split signatures to be passed in the Gateway multisig
 */
export declare function parseSigs(sig: string, hash: string, validators: string[]): IParsedSigsArray;
/**
 * Creates the default set of tx middleware required to successfully commit a tx to a Loom DAppChain.
 * @param client The client the middleware is being created for.
 * @param privateKey Private key that should be used to sign txs.
 * @returns Set of middleware.
 */
export declare function createDefaultTxMiddleware(client: Client, privateKey: Uint8Array): ITxMiddlewareHandler[];
export declare function sleep(ms: any): Promise<{}>;
/**
 * @param num Ethers BigNumber object, e.g. { _hex: '0x123' }.
 * Need to take the _hex, strip the '0x' and then make a hex BN
 */
export declare function hexBN(num: any): BN;
export declare function parseUrl(rawUrl: string): URL;
export declare function setupProtocolsFromEndpoint(endpoint: string): {
    writer: IJSONRPCClient;
    reader: IJSONRPCClient;
};
export declare function createDefaultClient(dappchainKey: string, dappchainEndpoint: string, chainId: string): {
    client: Client;
    publicKey: Uint8Array;
    address: Address;
};
export declare function createDefaultEthSignClientAsync(dappchainEndpoint: string, chainId: string, wallet: ethers.Signer): Promise<{
    client: Client;
    callerAddress: Address;
}>;
