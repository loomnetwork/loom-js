import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  TotalSupplyRequest,
  TotalSupplyResponse,
  BalanceOfRequest,
  BalanceOfResponse,
  AllowanceRequest,
  AllowanceResponse,
  TransferRequest,
  TransferFromRequest,
  ApproveRequest
} from '../proto/coin_pb'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'

export class Coin extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<Coin> {
    const contractAddr = await client.getContractAddressAsync('coin')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new Coin({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  async getTotalSupplyAsync(): Promise<BN> {
    const totalSupplyReq = new TotalSupplyRequest()
    const result = await this.staticCallAsync(
      'TotalSupply',
      totalSupplyReq,
      new TotalSupplyResponse()
    )
    return unmarshalBigUIntPB(result.getTotalSupply()!)
  }

  async getBalanceOfAsync(owner: Address): Promise<BN> {
    const balanceOfReq = new BalanceOfRequest()
    balanceOfReq.setOwner(owner.MarshalPB())
    const result = await this.staticCallAsync('BalanceOf', balanceOfReq, new BalanceOfResponse())
    return unmarshalBigUIntPB(result.getBalance()!)
  }

  async getAllowanceAsync(owner: Address, spender: Address): Promise<BN> {
    const allowanceReq = new AllowanceRequest()
    allowanceReq.setOwner(owner.MarshalPB())
    allowanceReq.setSpender(spender.MarshalPB())
    const result = await this.staticCallAsync('Allowance', allowanceReq, new AllowanceResponse())
    return unmarshalBigUIntPB(result.getAmount()!)
  }

  approveAsync(spender: Address, amount: BN) {
    const approveReq = new ApproveRequest()
    approveReq.setSpender(spender.MarshalPB())
    approveReq.setAmount(marshalBigUIntPB(amount))
    return this.callAsync<void>('Approve', approveReq)
  }

  transferAsync(to: Address, amount: BN) {
    const transferReq = new TransferRequest()
    transferReq.setTo(to.MarshalPB())
    transferReq.setAmount(marshalBigUIntPB(amount))
    return this.callAsync<void>('Transfer', transferReq)
  }

  transferFromAsync(from: Address, to: Address, amount: BN) {
    const transferFromReq = new TransferFromRequest()
    transferFromReq.setFrom(from.MarshalPB())
    transferFromReq.setTo(to.MarshalPB())
    transferFromReq.setAmount(marshalBigUIntPB(amount))
    return this.callAsync<void>('TransferFrom', transferFromReq)
  }
}
