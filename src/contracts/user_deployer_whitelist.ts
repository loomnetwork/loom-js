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

  addUserDeployerAsync(deployerAddr: Address, tierID: TierID): Promise<void> {
    const whitelistUserDeployerReq = new WhitelistUserDeployerRequest()
    whitelistUserDeployerReq.setDeployerAddr(deployerAddr.MarshalPB())
    whitelistUserDeployerReq.setTierid(tierID)
    return this.callAsync<void>('AddUserDeployer', whitelistUserDeployerReq)
  }

  async getUserDeployersAsync(userAddr: Address): Promise<Array<UserDeployerState>> {
    const getUserDeployerReq = new GetUserDeployersRequest()
    getUserDeployerReq.setUserAddr(userAddr.MarshalPB())
    const result = await this.staticCallAsync('GetUserDeployers', getUserDeployerReq, new GetUserDeployersResponse())
    return result.getDeployersList() as Array<UserDeployerState>
  }

  async getDeployedContractsAsync(deployerAddr: Address): Promise<Array<DeployerContract>> {
    const getDeployedContractsReq = new GetDeployedContractsRequest()
    getDeployedContractsReq.setDeployerAddr(deployerAddr.MarshalPB())
    const result = await this.staticCallAsync('GetDeployedContracts', getDeployedContractsReq, new GetDeployedContractsResponse())
    return result.getContractAddressesList() as Array<DeployerContract>
  }
}
