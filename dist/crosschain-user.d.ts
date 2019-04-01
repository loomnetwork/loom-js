import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
export declare class CrossChainUser {
    private _wallet;
    private _client;
    private _address;
    private _ethAddress;
    private _dappchainMapper;
    static createOfflineCrossChainUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChainUser>;
    static createMetamaskCrossChainUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChainUser>;
    static createEthSignMetamaskCrossChainUserAsync(web3: Web3, dappchainEndpoint: string, chainId: string): Promise<CrossChainUser>;
    static createCrossChainUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChainUser>;
    constructor(wallet: ethers.Signer, client: Client, address: Address, ethAddress: string, dappchainMapper: Contracts.AddressMapper | null);
    readonly client: Client;
    readonly wallet: ethers.Signer;
    readonly addressMapper: Contracts.AddressMapper | null;
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
