import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
import { TierID } from '../proto/user_deployer_whitelist_pb';
export interface IDeployer {
    address: Address;
    contracts: Array<IDeployedContract>;
    tierId: TierID;
    inactive: Boolean;
}
export interface IDeployedContract {
    address: Address;
}
export interface ITier {
    tierId: TierID;
    fee: BN;
    name: string;
}
/**
 * Provides self-service deployer account management for users that wish to deploy EVM contracts
 * to the DAppChain.
 */
export declare class UserDeployerWhitelist extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<UserDeployerWhitelist>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    /**
     * Authorizes an account to deploy EVM contracts on behalf of the caller. In order to authorize
     * an account the caller must approve the contract to withdraw the fee for whitelisting
     * (charged in LOOM coin) before calling this method, the fee will be deducted from the caller if
     * the requested account is successfuly authorized.
     *
     * @param deployer Deployer account address.
     * @param tierId
     */
    addDeployerAsync(deployer: Address, tierId?: TierID): Promise<void>;
    /**
     * Removes whitelisted deployer
     * @param deployer Deployer account address.
     */
    removeDeployerAsync(deployer: Address): Promise<void>;
    /**
     * @param user User account address.
     * @returns List of accounts authorized to deploy EVM contracts on behalf of the specified user.
     */
    getDeployersAsync(user: Address): Promise<Array<IDeployer>>;
    /**
     * @param deployer Deployer account address.
     * @returns Array of EVM contracts deployed by a particular deployer account.
     */
    getDeployedContractsAsync(deployer: Address): Promise<Array<IDeployedContract>>;
    /**
     * @param tierId ID of tier.
     * @returns Tier details.
     */
    getTierInfoAsync(tierId: TierID): Promise<ITier>;
    /**
     * Set tier details, can only be called by the UserDeployerWhitelist contract owner.
     *
     * @param tier Tier details.
     */
    setTierInfoAsync(tier: ITier): Promise<void>;
}
