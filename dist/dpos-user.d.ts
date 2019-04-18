import BN from 'bn.js';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Address, Client, Contracts } from '.';
import { GatewayUser, GatewayVersion } from './gateway-user';
import { IValidator, ICandidate, IDelegation, LockTimeTier, ITotalDelegation, ICandidateDelegations, IDelegatorDelegations } from './contracts/dpos2';
import { ERC20Gateway_v2 } from './mainnet-contracts/ERC20Gateway_v2';
import { ERC20 } from './mainnet-contracts/ERC20';
import { ValidatorManagerContract } from './mainnet-contracts/ValidatorManagerContract';
export declare class DPOSUser extends GatewayUser {
    private _dappchainDPOS;
    static createOfflineUserAsync(endpoint: string, privateKey: string, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<DPOSUser>;
    static createMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<DPOSUser>;
    static createEthSignMetamaskUserAsync(web3: Web3, dappchainEndpoint: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<DPOSUser>;
    static createUserAsync(wallet: ethers.Signer, dappchainEndpoint: string, dappchainKey: string, chainId: string, gatewayAddress: string, version?: GatewayVersion): Promise<DPOSUser>;
    constructor(wallet: ethers.Signer, client: Client, loomAddress: Address, ethAddress: string, gateway: ERC20Gateway_v2, loomToken: ERC20, vmc: ValidatorManagerContract | undefined, dappchainGateway: Contracts.LoomCoinTransferGateway, dappchainLoom: Contracts.Coin, dappchainDPOS: Contracts.DPOS2, dappchainMapper: Contracts.AddressMapper | null, version?: GatewayVersion);
    readonly dappchainDPOS: Contracts.DPOS2;
    listValidatorsAsync(): Promise<IValidator[]>;
    listCandidatesAsync(): Promise<ICandidate[]>;
    listAllDelegationsAsync(): Promise<Array<ICandidateDelegations>>;
    listDelegationsAsync(candidate: string): Promise<ICandidateDelegations>;
    listDelegatorDelegations(delegator?: string): Promise<IDelegatorDelegations>;
    getTimeUntilElectionsAsync(): Promise<BN>;
    /**
     * Delegates an amount of LOOM tokens to a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount delegated
     */
    delegateAsync(candidate: string, amount: BN, tier: LockTimeTier): Promise<void>;
    /**
     * Redelegates an amount of LOOM tokens from a validator to another
     *
     * @param formerValidator The candidate's hex address
     * @param newValidator The candidate's hex address
     * @param amount The amount delegated
     */
    redelegateAsync(formerValidator: string, validator: string, amount: BN): Promise<void>;
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
    /**
     * Returns the total stake a delegator has delegated to all validators
     *
     * @param delegator The delegator's hex address. If not supplied, will use the current account as a delegator.
     */
    getTotalDelegationAsync(delegator?: string): Promise<ITotalDelegation | null>;
    checkRewardsAsync(owner?: string): Promise<BN>;
}
