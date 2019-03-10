import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
export declare class CrossChain {
    private _wallet;
    private _client;
    private _address;
    private _ethAddress;
    private _dappchainMapper;
    static createOfflineUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChain>;
    static createMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChain>;
    static createUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string): Promise<CrossChain>;
    constructor(wallet: ethers.Signer, client: Client, address: Address, ethAddress: string, dappchainMapper: Contracts.AddressMapper);
    readonly client: Client;
    readonly wallet: ethers.Signer;
    readonly addressMapper: Contracts.AddressMapper;
    readonly ethAddress: string;
    readonly loomAddress: Address;
    /**
     * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
     *
     * @param account The user's account object
     * @param wallet The User's ethers wallet
     */
    mapAccountsAsync(): Promise<void>;
}
