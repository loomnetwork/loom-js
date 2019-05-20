import {Client} from '../client'
import {Contract} from '../contract'
import {Address} from '../address'
import {
  GetDeployedContractsRequest,
  GetDeployedContractsResponse,
  GetUserDeployersRequest,
  GetUserDeployersResponse,
  WhitelistUserDeployerRequest,
  TierID
} from '../proto/user_deployer_whitelist_pb'
// import {
//   unmarshalBigUIntPB,
//   marshalBigUIntPB
// } from '../big-uint'

export class UserDeployerWhitelist extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise < UserDeployerWhitelist > {
    const contractAddr = await client.getContractAddressAsync('user_deployer_whitelist')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new UserDeployerWhitelist({
      contractAddr,
      callerAddr,
      client
    })
  }

  constructor(params: {
    contractAddr: Address;callerAddr: Address;client: Client
  }) {
    super(params)
  }

  async getUserDeployersAsync(): Promise < GetUserDeployersResponse > {
    const getUserDeployerReq = new GetUserDeployersRequest()
    const result = await this.staticCallAsync('GetUserDeployers', getUserDeployerReq, new GetUserDeployersResponse())
    return result
  }
  async getDeployedContractsAsync(deployerAddr: Address): Promise < GetDeployedContractsResponse > {
    const getDeployedContractsReq = new GetDeployedContractsRequest()
    getDeployedContractsReq.setDeployeraddr(deployerAddr.MarshalPB())
    const result = await this.staticCallAsync('GetDeployedContracts', getDeployedContractsReq, new GetDeployedContractsResponse())
    return result
  }

  
  addUserDeployer(deployerAddr: Address, tier_id: TierID): Promise < void > {
    const whitelistUserDeployerReq = new WhitelistUserDeployerRequest()
    whitelistUserDeployerReq.setDeployeraddr(deployerAddr.MarshalPB())
    whitelistUserDeployerReq.setTierId(tier_id)
    return this.callAsync < void > ('AddUserDeployer', whitelistUserDeployerReq)
  }

  