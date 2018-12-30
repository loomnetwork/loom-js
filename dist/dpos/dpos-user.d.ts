import BN from 'bn.js';
import { Address, Client, Contracts } from '..';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { IWithdrawalReceipt } from '../contracts/transfer-gateway';
import { IValidator, ICandidate, IDelegation } from '../contracts/dpos2';
export declare class DPOSUser {
    private _wallet;
    private _client;
    private _address;
    private _ethAddress;
    private _ethereumGateway;
    private _ethereumLoom;
    private _dappchainGateway;
    private _dappchainLoom;
    private _dappchainDPOS;
    private _dappchainMapper;
    static createOfflineUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<DPOSUser>;
    static createMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<DPOSUser>;
    static createUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, loomAddress: string): Promise<DPOSUser>;
    constructor(wallet: ethers.Signer, client: Client, address: Address, ethAddress: string, gatewayAddress: string, loomAddress: string, dappchainGateway: Contracts.LoomCoinTransferGateway, dappchainLoom: Contracts.Coin, dappchainDPOS: Contracts.DPOS2, dappchainMapper: Contracts.AddressMapper);
    readonly ethereumGateway: ethers.Contract;
    readonly ethereumLoom: ethers.Contract;
    readonly dappchainLoom: Contracts.Coin;
    readonly dappchainGateway: Contracts.LoomCoinTransferGateway;
    readonly dappchainDPOS: Contracts.DPOS2;
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
    listValidatorsAsync(): Promise<IValidator[]>;
    listCandidatesAsync(): Promise<ICandidate[]>;
    /**
     * Deposits funds from mainnet to the gateway
     */
    depositAsync(amount: BN): Promise<ethers.ContractTransaction>;
    /**
     * Withdraw funds from the gateway to mainnet
     */
    withdrawAsync(amount: BN): Promise<ethers.ContractTransaction>;
    resumeWithdrawalAsync(): Promise<ethers.ContractTransaction | undefined>;
    /**
     * Delegates an amount of LOOM tokens to a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount delegated
     */
    delegateAsync(candidate: string, amount: BN): Promise<void>;
    /**
     * Undelegates an amount of LOOM tokens from a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount to undelegate
     */
    undelegateAsync(candidate: string, amount: BN): Promise<void>;
    claimDelegationsAsync(withdrawalAddress?: string): Promise<void>;
    /**
     * Returns the stake a delegator has delegated to a candidate/validator
     *
     * @param validator The validator's hex address
     * @param delegator The delegator's hex address
     */
    checkDelegationsAsync(validator: string, delegator?: string): Promise<IDelegation | null>;
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
    /**
     * Helper function to prefix an address with the chainId to get chainId:address format
     */
    private prefixAddress;
}
