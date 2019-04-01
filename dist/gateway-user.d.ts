import BN from 'bn.js';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
import { IWithdrawalReceipt } from './contracts/transfer-gateway';
import { CrossChainUser } from './crosschain-user';
import { ERC20 } from './mainnet-contracts/ERC20';
import { ValidatorManagerContract } from './mainnet-contracts/ValidatorManagerContract';
import { ERC20Gateway_v2 } from './mainnet-contracts/ERC20Gateway_v2';
export declare enum GatewayVersion {
    SINGLESIG = 1,
    MULTISIG = 2
}
export interface EthereumContracts {
    gateway: ERC20Gateway_v2;
    loomToken: ERC20;
    vmc?: ValidatorManagerContract;
}
export declare class GatewayUser extends CrossChainUser {
    private _ethereumGateway;
    private _ethereumLoom;
    private _ethereumVMC?;
    private _dappchainGateway;
    private _dappchainLoom;
    private _version;
    static createGatewayOfflineUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: number): Promise<GatewayUser>;
    static createGatewayMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<GatewayUser>;
    static getContracts(wallet: ethers.Signer, gatewayAddress: string, version?: GatewayVersion): Promise<EthereumContracts>;
    private static getGatewayVersion;
    static createEthSignMetamaskGatewayUserAsync(web3: Web3, dappchainEndpoint: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<GatewayUser>;
    static createGatewayUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<GatewayUser>;
    constructor(wallet: ethers.Signer, client: Client, address: Address, ethAddress: string, gateway: ethers.Contract, loomToken: ethers.Contract, vmc: ethers.Contract | undefined, dappchainGateway: Contracts.LoomCoinTransferGateway, dappchainLoom: Contracts.Coin, dappchainMapper: Contracts.AddressMapper | null, version?: GatewayVersion);
    readonly ethereumVMC: ethers.Contract | undefined;
    readonly ethereumGateway: ethers.Contract;
    readonly ethereumLoom: ethers.Contract;
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
    /**
     * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
     *
     * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
     */
    private depositCoinToDAppChainGatewayAsync;
    getUnclaimedLoomTokensAsync(owner?: string): Promise<BN>;
    private withdrawCoinFromDAppChainGatewayAsync;
    private createWithdrawalHash;
    /**
     * Helper function to prefix an address with the chainId to get chainId:address format
     */
    prefixAddress(address: string): Address;
}
