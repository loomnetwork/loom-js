import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  GetDeployedContractsRequest,
  GetDeployedContractsResponse,
  GetUserDeployersRequest,
  GetUserDeployersResponse,
  WhitelistUserDeployerRequest,
  TierID,
  DeployerContract,
  UserDeployerState
} from '../proto/user_deployer_whitelist_pb'

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
   * @param user User account address.
   * @returns List of accounts authorized to deploy EVM contracts on behalf of the specified user.
   */
  async getDeployersAsync(user: Address): Promise<Array<UserDeployerState>> {
    const req = new GetUserDeployersRequest()
    req.setUserAddr(user.MarshalPB())
    const result = await this.staticCallAsync(
      'GetUserDeployers',
      req,
      new GetUserDeployersResponse()
    )
    return result.getDeployersList()
  }

  /**
   * @param deployer Deployer account address.
   * @returns Array of EVM contracts deployed by a particular deployer account.
   */
  async getDeployedContractsAsync(deployer: Address): Promise<Array<DeployerContract>> {
    const req = new GetDeployedContractsRequest()
    req.setDeployerAddr(deployer.MarshalPB())
    const result = await this.staticCallAsync(
      'GetDeployedContracts',
      req,
      new GetDeployedContractsResponse()
    )
    return result.getContractAddressesList()
  }
}
