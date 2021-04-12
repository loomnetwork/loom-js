import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  ListCandidatesRequest,
  ListCandidatesResponse,
  ListValidatorsRequest,
  ListValidatorsResponse,
  DelegateRequest,
  UnbondRequest,
  CheckDelegationRequest,
  CheckDelegationResponse,
  RegisterCandidateRequestV3,
  UnregisterCandidateRequestV3,
  ValidatorStatistic,
  TimeUntilElectionRequestV3,
  TimeUntilElectionResponseV3,
  RedelegateRequest,
  ListAllDelegationsRequestV3,
  ListAllDelegationsResponseV3,
  ListDelegationsRequestV3,
  ListDelegationsResponseV3,
  Delegation,
  CheckAllDelegationsResponseV3,
  CheckAllDelegationsRequestV3,
  CandidateStatistic,
  LocktimeTier,
  ConsolidateDelegationsRequest,
  CheckDelegatorRewardsRequest,
  CheckDelegatorRewardsResponse,
  ClaimDelegatorRewardsRequest,
  ClaimDelegatorRewardsResponse,
  DelegationState,
  CandidateState,
  State,
  GetStateRequest,
  GetStateResponse
} from '../proto/dposv3_pb'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'

export interface IState {
  maxYearlyRewards: BN
  totalWeightedAmountStaked: BN
}

export interface ICandidate {
  address: Address
  pubKey: Uint8Array
  delegationTotal: BN
  slashPercentage: BN
  whitelistAmount: BN
  whitelistLocktimeTier: LocktimeTier
  maxReferralPercentage?: number

  fee: BN
  newFee: BN
  candidateState: CandidateState

  name: string
  description: string
  website: string
}

export interface IValidator {
  address: Address
  recentlyMissedBlocks: number
  slashPercentage: BN
  delegationTotal: BN
  whitelistAmount: BN
  whitelistLocktimeTier: LocktimeTier
  jailed: boolean
}

export interface IDelegation {
  validator: Address
  updateValidator?: Address
  delegator: Address
  index: number
  amount: BN
  updateAmount: BN
  lockTime: number
  lockTimeTier: LocktimeTier
  state: DelegationState
  referrer: string
}

export interface ITotalDelegation {
  amount: BN
  weightedAmount: BN
}

export interface ICandidateDelegations {
  delegationTotal: BN
  delegationsArray: Array<IDelegation>
}

export interface IDelegatorDelegations {
  amount: BN
  weightedAmount: BN
  delegationsArray: Array<IDelegation>
}

export class DPOS3 extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<DPOS3> {
    const contractAddr = await client.getContractAddressAsync('dposV3')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new DPOS3({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  async getTimeUntilElectionAsync(): Promise<BN> {
    const timeUntilElectionRequest = new TimeUntilElectionRequestV3()
    const result = await this.staticCallAsync(
      'TimeUntilElection',
      timeUntilElectionRequest,
      new TimeUntilElectionResponseV3()
    )

    return new BN(result.getTimeUntilElection())
  }

  async getCandidatesAsync(): Promise<Array<ICandidate>> {
    const listCandidatesReq = new ListCandidatesRequest()
    const result = await this.staticCallAsync(
      'ListCandidates',
      listCandidatesReq,
      new ListCandidatesResponse()
    )

    return result.getCandidatesList().map((candidate: CandidateStatistic) => {
      const c = candidate.getCandidate()!
      // statistic may not exist yet for a candidate that was just registered (without being whitelisted)
      const s = candidate.getStatistic()
      return {
        address: Address.UnmarshalPB(c.getAddress()!),
        pubKey: c.getPubKey_asU8(),
        delegationTotal:
          s && s.getDelegationTotal() ? unmarshalBigUIntPB(s.getDelegationTotal()!) : new BN(0),
        slashPercentage:
          s && s.getSlashPercentage() ? unmarshalBigUIntPB(s.getSlashPercentage()!) : new BN(0),
        whitelistAmount:
          s && s.getWhitelistAmount() ? unmarshalBigUIntPB(s.getWhitelistAmount()!) : new BN(0),
        whitelistLocktimeTier: s ? s.getLocktimeTier() : LocktimeTier.TIER_ZERO,
        maxReferralPercentage: c.getMaxReferralPercentage(),

        fee: new BN(c.getFee()),
        newFee: new BN(c.getNewFee()),
        candidateState: c.getState(),
        name: c.getName(),
        description: c.getDescription(),
        website: c.getWebsite()
      }
    })
  }

  async getValidatorsAsync(): Promise<Array<IValidator>> {
    const listValidatorReq = new ListValidatorsRequest()
    const result = await this.staticCallAsync(
      'ListValidators',
      listValidatorReq,
      new ListValidatorsResponse()
    )

    return result.getStatisticsList().map((validator: ValidatorStatistic) => ({
      address: Address.UnmarshalPB(validator.getAddress()!),
      recentlyMissedBlocks: validator.getRecentlyMissedBlocks(),
      whitelistAmount: validator.getWhitelistAmount()
        ? unmarshalBigUIntPB(validator.getWhitelistAmount()!)
        : new BN(0),
      whitelistLocktimeTier: validator.getLocktimeTier(),
      slashPercentage: validator.getSlashPercentage()
        ? unmarshalBigUIntPB(validator.getSlashPercentage()!)
        : new BN(0),
      delegationTotal: validator.getDelegationTotal()
        ? unmarshalBigUIntPB(validator.getDelegationTotal()!)
        : new BN(0),
      jailed: validator.getJailed()
    }))
  }

  async getDelegations(candidate: Address): Promise<ICandidateDelegations> {
    const listDelegationsReq = new ListDelegationsRequestV3()
    listDelegationsReq.setCandidate(candidate.MarshalPB())
    const result = await this.staticCallAsync(
      'ListDelegations',
      listDelegationsReq,
      new ListDelegationsResponseV3()
    )

    return {
      delegationTotal: result.getDelegationTotal()
        ? unmarshalBigUIntPB(result.getDelegationTotal()!)
        : new BN(0),
      delegationsArray: result.getDelegationsList().map(this.getDelegation)
    }
  }

  async getAllDelegations(): Promise<Array<ICandidateDelegations>> {
    const listAllDelegationsReq = new ListAllDelegationsRequestV3()
    const result = await this.staticCallAsync(
      'ListAllDelegations',
      listAllDelegationsReq,
      new ListAllDelegationsResponseV3()
    )

    return result.getListResponsesList().map(d => {
      return {
        delegationTotal: d.getDelegationTotal()
          ? unmarshalBigUIntPB(d.getDelegationTotal()!)
          : new BN(0),
        delegationsArray: d.getDelegationsList().map(this.getDelegation)
      }
    })
  }

  // gets all the delegations by a delegator
  async checkAllDelegationsAsync(delegator: Address): Promise<IDelegatorDelegations> {
    const checkDelegatorDelegationsReq = new CheckAllDelegationsRequestV3()
    checkDelegatorDelegationsReq.setDelegatorAddress(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'CheckAllDelegations',
      checkDelegatorDelegationsReq,
      new CheckAllDelegationsResponseV3()
    )

    return {
      amount: result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0),
      weightedAmount: result.getWeightedAmount()
        ? unmarshalBigUIntPB(result.getWeightedAmount()!)
        : new BN(0),
      delegationsArray: result.getDelegationsList().map(this.getDelegation)
    }
  }

  // get all the delegations by a delegator to a specific validator
  async checkDelegationAsync(
    validator: Address,
    delegator: Address
  ): Promise<IDelegatorDelegations | null> {
    const checkDelegationReq = new CheckDelegationRequest()
    checkDelegationReq.setValidatorAddress(validator.MarshalPB())
    checkDelegationReq.setDelegatorAddress(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'CheckDelegation',
      checkDelegationReq,
      new CheckDelegationResponse()
    )

    return {
      amount: result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0),
      weightedAmount: result.getWeightedAmount()
        ? unmarshalBigUIntPB(result.getWeightedAmount()!)
        : new BN(0),
      delegationsArray: result.getDelegationsList().map(this.getDelegation)
    } as IDelegatorDelegations
  }

  registerCandidateAsync(
    pubKey: string,
    fee: BN,
    name: string,
    description: string,
    website: string,
    tier: LocktimeTier
  ): Promise<void> {
    const registerCandidateRequest = new RegisterCandidateRequestV3()
    registerCandidateRequest.setPubKey(pubKey)
    registerCandidateRequest.setFee(fee.toNumber())
    registerCandidateRequest.setName(name)
    registerCandidateRequest.setDescription(description)
    registerCandidateRequest.setWebsite(website)
    registerCandidateRequest.setLocktimeTier(tier)
    return this.callAsync<void>('RegisterCandidate', registerCandidateRequest)
  }

  unregisterCandidateAsync(): Promise<void> {
    const unregisterCandidateRequest = new UnregisterCandidateRequestV3()
    return this.callAsync<void>('UnregisterCandidate', unregisterCandidateRequest)
  }

  delegateAsync(
    validator: Address,
    amount: BN,
    tier: LocktimeTier,
    referrer?: string
  ): Promise<void> {
    const delegateRequest = new DelegateRequest()
    delegateRequest.setValidatorAddress(validator.MarshalPB())
    delegateRequest.setAmount(marshalBigUIntPB(amount))
    delegateRequest.setLocktimeTier(tier)
    if (referrer) {
      delegateRequest.setReferrer(referrer)
    }
    return this.callAsync<void>('Delegate', delegateRequest)
  }

  redelegateAsync(
    oldValidator: Address,
    validator: Address,
    amount: BN,
    index: number,
    referrer?: string
  ): Promise<void> {
    const redelegateRequest = new RedelegateRequest()
    redelegateRequest.setFormerValidatorAddress(oldValidator.MarshalPB())
    redelegateRequest.setValidatorAddress(validator.MarshalPB())
    redelegateRequest.setAmount(marshalBigUIntPB(amount))
    redelegateRequest.setIndex(index)
    if (referrer) {
      redelegateRequest.setReferrer(referrer)
    }
    return this.callAsync<void>('Redelegate', redelegateRequest)
  }

  consolidateDelegations(validator: Address): Promise<void> {
    const req = new ConsolidateDelegationsRequest()
    req.setValidatorAddress(validator.MarshalPB())
    return this.callAsync<void>('ConsolidateDelegations', req)
  }

  unbondAsync(validator: Address, amount: BN | number | string, index: number): Promise<void> {
    const unbondRequest = new UnbondRequest()
    unbondRequest.setValidatorAddress(validator.MarshalPB())
    unbondRequest.setAmount(marshalBigUIntPB(new BN(amount)))
    unbondRequest.setIndex(index)
    return this.callAsync<void>('Unbond', unbondRequest)
  }

  async claimDelegatorRewardsAsync(): Promise<BN> {
    const req = new ClaimDelegatorRewardsRequest()
    const resp = new ClaimDelegatorRewardsResponse()
    await this.callAsync('ClaimRewardsFromAllValidators', req, resp)

    return resp.getAmount() ? unmarshalBigUIntPB(resp.getAmount()!) : new BN(0)
  }

  async checkDelegatorRewardsAsync(delegator: Address): Promise<BN> {
    const req = new CheckDelegatorRewardsRequest()
    req.setDelegator(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'CheckRewardsFromAllValidators',
      req,
      new CheckDelegatorRewardsResponse()
    )

    return result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0)
  }

  async getStateAsync(): Promise<IState> {
    const req = new GetStateRequest()
    const res = await this.staticCallAsync('GetState', req, new GetStateResponse())
    const state = res.getState()!
    const params = state.getParams()!
    const maxYearlyRewards = unmarshalBigUIntPB(params.getMaxYearlyReward()!)
    const totalWeightedAmountStaked = unmarshalBigUIntPB(state.getTotalValidatorDelegations()!)
    return {
      maxYearlyRewards,
      totalWeightedAmountStaked
    }
  }

  private getDelegation(delegation: Delegation): IDelegation {
    return {
      validator: Address.UnmarshalPB(delegation.getValidator()!),
      updateValidator: delegation.getUpdateValidator()
        ? Address.UnmarshalPB(delegation.getUpdateValidator()!)
        : undefined,
      delegator: Address.UnmarshalPB(delegation.getDelegator()!),
      amount: delegation.getAmount() ? unmarshalBigUIntPB(delegation.getAmount()!) : new BN(0),
      updateAmount: delegation.getUpdateAmount()
        ? unmarshalBigUIntPB(delegation.getUpdateAmount()!)
        : new BN(0),
      index: delegation.getIndex(),
      lockTime: delegation.getLockTime(),
      lockTimeTier: delegation.getLocktimeTier(),
      state: delegation.getState(),
      referrer: delegation.getReferrer()
    } as IDelegation
  }
}
