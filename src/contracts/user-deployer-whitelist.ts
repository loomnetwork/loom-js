import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  GetDeployedContractsRequest,
  GetDeployedContractsResponse,
  GetUserDeployersRequest,
  GetUserDeployersResponse,
  GetTierInfoRequest,
  GetTierInfoResponse,
  WhitelistUserDeployerRequest,
  SetTierInfoRequest,
  RemoveUserDeployerRequest,
  TierID,
  Tier,
  DeployerContract,
  UserDeployerState
} from '../proto/user_deployer_whitelist_pb'
import { marshalBigUIntPB, unmarshalBigUIntPB } from '../big-uint'

export interface IDeployer {
  address: Address
  contracts: Array<IDeployedContract>
  tierId: TierID
  inactive: Boolean
}

export interface IDeployedContract {
  address: Address
}

export interface ITier {
  tierId: TierID
  fee: BN
  name: string
}

/**
 * Provides self-service deployer account management for users that wish to deploy EVM contracts
 * to the DAppChain.
 */
export class UserDeployerWhitelist extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<UserDeployerWhitelist> {
    const contractAddr = await client.getContractAddressAsync('user-deployer-whitelist')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new UserDeployerWhitelist({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  /**
   * Authorizes an account to deploy EVM contracts on behalf of the caller. In order to authorize
   * an account the caller must approve the contract to withdraw the fee for whitelisting
   * (charged in LOOM coin) before calling this method, the fee will be deducted from the caller if
   * the requested account is successfuly authorized.
   *
   * @param deployer Deployer account address.
   * @param tierId
   */
  addDeployerAsync(deployer: Address, tierId?: TierID): Promise<void> {
    const req = new WhitelistUserDeployerRequest()
    req.setDeployerAddr(deployer.MarshalPB())
    req.setTierId(tierId ? tierId : TierID.DEFAULT)
    return this.callAsync<void>('AddUserDeployer', req)
  }

  /**
   * Removes whitelisted deployer
   * @param deployer Deployer account address.
   */
  removeDeployerAsync(deployer: Address): Promise<void> {
    const req = new RemoveUserDeployerRequest()
    req.setDeployerAddr(deployer.MarshalPB())
    return this.callAsync<void>('RemoveUserDeployer', req)
  }

  /**
   * @param user User account address.
   * @returns List of accounts authorized to deploy EVM contracts on behalf of the specified user.
   */
  async getDeployersAsync(user: Address): Promise<Array<IDeployer>> {
    const req = new GetUserDeployersRequest()
    req.setUserAddr(user.MarshalPB())
    const result = await this.staticCallAsync(
      'GetUserDeployers',
      req,
      new GetUserDeployersResponse()
    )
    return result.getDeployersList().map(userDeployerState => ({
      address: Address.UnmarshalPB(userDeployerState.getAddress()!),
      contracts: userDeployerState.getContractsList().map(deployerContract => ({
        address: Address.UnmarshalPB(deployerContract.getContractAddress()!)
      })),
      tierId: userDeployerState.getTierId(),
      inactive: userDeployerState.getInactive()
    }))
  }

  /**
   * @param deployer Deployer account address.
   * @returns Array of EVM contracts deployed by a particular deployer account.
   */
  async getDeployedContractsAsync(deployer: Address): Promise<Array<IDeployedContract>> {
    const req = new GetDeployedContractsRequest()
    req.setDeployerAddr(deployer.MarshalPB())
    const result = await this.staticCallAsync(
      'GetDeployedContracts',
      req,
      new GetDeployedContractsResponse()
    )
    return result.getContractAddressesList().map(deployerContract => ({
      address: Address.UnmarshalPB(deployerContract.getContractAddress()!)
    }))
  }

  /**
   * @param tierId ID of tier.
   * @returns Tier details.
   */
  async getTierInfoAsync(tierId: TierID): Promise<ITier> {
    const req = new GetTierInfoRequest()
    req.setId(tierId)
    const result = await this.staticCallAsync('GetTierInfo', req, new GetTierInfoResponse())
    return {
      tierId: result.getTier()!.getTierId(),
      fee: unmarshalBigUIntPB(result.getTier()!.getFee()!),
      name: result.getTier()!.getName()
    }
  }

  /**
   * Set tier details, can only be called by the UserDeployerWhitelist contract owner.
   *
   * @param tier Tier details.
   */
  async setTierInfoAsync(tier: ITier): Promise<void> {
    const req = new SetTierInfoRequest()
    if (tier.fee.cmp(new BN(0)) <= 0) {
      throw Error('fee must be greater than zero')
    }
    req.setFee(marshalBigUIntPB(tier.fee))
    req.setId(tier.tierId)
    req.setName(tier.name)
    return this.callAsync<void>('SetTierInfo', req)
  }
}
