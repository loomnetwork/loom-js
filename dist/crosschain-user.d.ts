import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
export interface CrossChainUserParams {
    dappchainEndpoint: string;
    chainId: string;
    dappchainPrivateKey?: string;
    ethereumPrivateKey?: string;
    web3?: Web3;
    ethEndpoint?: string;
    wallet?: ethers.Signer;
}
export interface CrossChainUserConstructorParams {
    wallet: ethers.Signer;
    client: Client;
    loomAddress: Address;
    ethAddress: string;
    addressMapper?: Contracts.AddressMapper;
}
export declare class CrossChainUser {
    private _wallet;
    private _client;
    private _loomAddress;
    private _ethAddress;
    private _addressMapper?;
    static createOfflineCrossChainUserAsync(params: CrossChainUserParams): Promise<CrossChainUser>;
    static createMetamaskCrossChainUserAsync(params: CrossChainUserParams): Promise<CrossChainUser>;
    static createEthSignMetamaskCrossChainUserAsync(params: CrossChainUserParams): Promise<CrossChainUser>;
    static createCrossChainUserAsync(params: CrossChainUserParams): Promise<CrossChainUser>;
    constructor(params: CrossChainUserConstructorParams);
    readonly client: Client;
    readonly wallet: ethers.Signer;
    readonly addressMapper: Contracts.AddressMapper | undefined;
    readonly ethAddress: string;
    readonly loomAddress: Address;
    disconnect(): void;
    /**
     * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
     *
     * @param account The user's account object
     * @param wallet The User's ethers wallet
     */
    mapAccountsAsync(): Promise<void>;
}
