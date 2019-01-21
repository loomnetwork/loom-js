import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  KarmaAddressSource, KarmaUserAmount, KarmaStateKeyUser, KarmaSources, KarmaSourceReward, KarmaState, KarmaSourceTarget, KarmaUserTarget, KarmaTotal
} from '../proto/karma_pb'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'

export class Karma extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<DPOS> {
    const contractAddr = await client.getContractAddressAsync('dpos')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new Karma({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  async depositCoinAsync(amount: BN, from: Address): Promise<void> {
    const karmaUserAmountReq = new KarmaUserAmount()
    karmaUserAmountReq.setAmount(marshalBigUIntPB(amount))
    karmaUserAmountReq.setUser(from.MarshalPB())
    return this.callAsync<void>('DepositCoin', karmaUserAmountReq)
  }

  async withdrawCoinAsync(amount: BN, to: Address): Promise<void> {
    const karmaUserAmountReq = new KarmaUserAmount()
    karmaUserAmountReq.setAmount(marshalBigUIntPB(amount))
    karmaUserAmountReq.setUser(to.MarshalPB())
    return this.callAsync<void>('WithdrawCoin', karmaUserAmountReq)
  }

  async getUserStateAsync(user: Address): Promise<KarmaState> {
    let response: any
    const result = await this.staticCallAsync(
      'GetUserState',
      user.MarshalPB(),
      response
    )
    return result
  }

  async getSourcesAsync(user: Address): Promise<KarmaSources> {
    let response: any
    const result = await this.staticCallAsync(
      'GetSources',
      user.MarshalPB(),
      response
    )
    return result
  }

  async getUserKarmaAsync(user: Address, target: KarmaSourceTarget): Promise<KarmaTotal> {
    const karmaUserTargetReq = new KarmaUserTarget()
    let response: any
    karmaUserTargetReq.setUser(user.MarshalPB())
    karmaUserTargetReq.setTarget(target)
    const result = await this.staticCallAsync(
      'GetUserKarma',
      karmaUserTargetReq,
      response
    )
    return result
  }

}
