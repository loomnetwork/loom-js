import BN from 'bn.js';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
import { IWithdrawalReceipt } from './contracts/transfer-gateway';
import { CrossChain } from './crosschain';
import { ERC20Gateway } from './mainnet-contracts/ERC20Gateway';
import { ERC20 } from './mainnet-contracts/ERC20';
export declare class GatewayUser extends CrossChain {
    private _ethereumGateway;
    private _ethereumLoom;
    private _dappchainGateway;
    private _dappchainLoom;
    static createGatewayOfflineUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<GatewayUser>;
    static createGatewayMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<GatewayUser>;
    static createGatewayUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<GatewayUser>;
    constructor(wallet: ethers.Signer, client: Client, address: Address, ethAddress: string, gatewayAddress: string, loomAddress: string, dappchainGateway: Contracts.LoomCoinTransferGateway, dappchainLoom: Contracts.Coin, dappchainMapper: Contracts.AddressMapper);
    readonly ethereumGateway: ERC20Gateway;
    readonly ethereumLoom: ERC20;
    readonly dappchainLoom: Contracts.Coin;
    readonly dappchainGateway: Contracts.LoomCoinTransferGateway;
    /**
     * Deposits funds from mainnet to the gateway
     */
    depositAsync(amount: BN): Promise<ethers.ContractTransaction>;
    /**
     * Withdraw funds from the gateway to mainnet
     */
    withdrawAsync(amount: BN): Promise<ethers.ContractTransaction>;
    resumeWithdrawalAsync(): Promise<ethers.ContractTransaction | undefined>;
    getPendingWithdrawalReceiptAsync(): Promise<IWithdrawalReceipt | null>;
    /**
     * Retrieves the  DAppChain LoomCoin balance of a user
     * @param address The address to check the balance of. If not provided, it will check the user's balance
     */
    getDAppChainBalanceAsync(address: string | undefined): Promise<BN>;
    disconnect(): void;
    /**
     * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
     *
     * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
     */
    private depositCoinToDAppChainGatewayAsync;
    private withdrawCoinFromRinkebyGatewayAsync;
}
