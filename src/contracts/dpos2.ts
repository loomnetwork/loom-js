import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  ListCandidateRequestV2,
  ListCandidateResponseV2,
  CandidateV2,
  ClaimDistributionRequestV2,
  CheckDistributionRequest,
  ListValidatorsRequestV2,
  ListValidatorsResponseV2,
  DelegateRequestV2,
  UnbondRequestV2,
  CheckDelegationRequestV2,
  CheckDelegationResponseV2,
  RegisterCandidateRequestV2,
  UnregisterCandidateRequestV2,
  ValidatorStatisticV2,
  CheckDistributionResponse,
  TotalDelegationRequest,
  TotalDelegationResponse,
  TimeUntilElectionRequest,
  TimeUntilElectionResponse,
  RedelegateRequestV2,
  ListAllDelegationsRequest,
  ListAllDelegationsResponse,
  ListDelegationsRequest,
  ListDelegationsResponse,
  DelegationV2,
  CheckAllDelegationsResponse,
  CheckAllDelegationsRequest
} from '../proto/dposv2_pb'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'

export enum DelegationState {
  BONDING = 0,
  BONDED = 1,
  UNBONDING = 2,
  REDELEGATING = 3
}

export enum LockTimeTier {
  Tier0 = 0,
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3
}

export interface ICandidate {
  pubKey: Uint8Array
  address: Address
  fee: BN
  newFee: BN
  feeDelayCounter: BN
  name: string
  description: string
  website: string
}

export interface IValidator {
  address: Address
  pubKey: Uint8Array
  upblockCount: number
  blockCount: number
  slashPct: BN
  distributionTotal: BN
  delegationTotal: BN
  whitelistAmount: BN
  whitelistLockTime: BN
}

export interface IDelegation {
  validator: Address
  updateValidator?: Address
  delegator: Address
  height: BN
  amount: BN
  updateAmount: BN
  lockTime: number
  lockTimeTier: number
  state: DelegationState
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

export class DPOS2 extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<DPOS2> {
    const contractAddr = await client.getContractAddressAsync('dposV2')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new DPOS2({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  async getTimeUntilElectionAsync(): Promise<BN> {
    const timeUntilElectionRequest = new TimeUntilElectionRequest()
    const result = await this.staticCallAsync(
      'TimeUntilElection',
      timeUntilElectionRequest,
      new TimeUntilElectionResponse()
    )

    return new BN(result.getTimeUntilElection())
  }

  async getCandidatesAsync(): Promise<Array<ICandidate>> {
    const listCandidatesReq = new ListCandidateRequestV2()
    const result = await this.staticCallAsync(
      'ListCandidates',
      listCandidatesReq,
      new ListCandidateResponseV2()
    )

    return result.getCandidatesList().map((candidate: CandidateV2) => ({
      pubKey: candidate.getPubKey_asU8()!,
      address: Address.UnmarshalPB(candidate.getAddress()!),
      fee: new BN(candidate.getFee()!),
      newFee: new BN(candidate.getNewfee()!),
      feeDelayCounter: new BN(candidate.getFeedelaycounter()!),
      name: candidate.getName(),
      description: candidate.getDescription(),
      website: candidate.getWebsite()
    }))
  }

  async getValidatorsAsync(): Promise<Array<IValidator>> {
    const listValidatorReq = new ListValidatorsRequestV2()
    const result = await this.staticCallAsync(
      'ListValidators',
      listValidatorReq,
      new ListValidatorsResponseV2()
    )

    return result.getStatisticsList().map((validator: ValidatorStatisticV2) => ({
      address: Address.UnmarshalPB(validator.getAddress()!),
      pubKey: validator.getPubKey_asU8()!,
      upblockCount: validator.getUpblockCount(),
      blockCount: validator.getBlockCount(),
      whitelistAmount: validator.getWhitelistAmount()
        ? unmarshalBigUIntPB(validator.getWhitelistAmount()!)
        : new BN(0),
      whitelistLockTime: new BN(validator.getWhitelistLocktime()!),
      slashPct: validator.getSlashPercentage()
        ? unmarshalBigUIntPB(validator.getSlashPercentage()!)
        : new BN(0),
      distributionTotal: validator.getDistributionTotal()
        ? unmarshalBigUIntPB(validator.getDistributionTotal()!)
        : new BN(0),
      delegationTotal: validator.getDelegationTotal()
        ? unmarshalBigUIntPB(validator.getDelegationTotal()!)
        : new BN(0)
    }))
  }

  async getDelegations(candidate: Address): Promise<ICandidateDelegations> {
    const listDelegationsReq = new ListDelegationsRequest()
    listDelegationsReq.setCandidate(candidate.MarshalPB())
    const result = await this.staticCallAsync(
      'ListDelegations',
      listDelegationsReq,
      new ListDelegationsResponse()
    )

    return {
      delegationTotal: result.getDelegationTotal()
        ? unmarshalBigUIntPB(result.getDelegationTotal()!)
        : new BN(0),
      delegationsArray: result.getDelegationsList().map(this.getDelegation)
    }
  }

  async getAllDelegations(): Promise<Array<ICandidateDelegations>> {
    const listAllDelegationsReq = new ListAllDelegationsRequest()
    const result = await this.staticCallAsync(
      'ListAllDelegations',
      listAllDelegationsReq,
      new ListAllDelegationsResponse()
    )

    return result.getListresponsesList().map(d => {
      return {
        delegationTotal: d.getDelegationTotal()
          ? unmarshalBigUIntPB(d.getDelegationTotal()!)
          : new BN(0),
        delegationsArray: d.getDelegationsList().map(this.getDelegation)
      }
    })
  }

  async checkDelegatorDelegations(delegator: Address): Promise<IDelegatorDelegations> {
    const checkDelegatorDelegationsReq = new CheckAllDelegationsRequest()
    checkDelegatorDelegationsReq.setDelegatorAddress(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'CheckAllDelegations',
      checkDelegatorDelegationsReq,
      new CheckAllDelegationsResponse()
    )

    return {
      amount: result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0),
      weightedAmount: result.getWeightedAmount()
        ? unmarshalBigUIntPB(result.getWeightedAmount()!)
        : new BN(0),
      delegationsArray: result.getDelegationsList().map(this.getDelegation)
    }
  }

  async checkDistributionAsync(): Promise<BN> {
    const checkDistributionReq = new CheckDistributionRequest()
    const result = await this.staticCallAsync(
      'CheckDistribution',
      checkDistributionReq,
      new CheckDistributionResponse()
    )
    return result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0)
  }

  async totalDelegationAsync(delegator: Address): Promise<ITotalDelegation | null> {
    const totalDelegationReq = new TotalDelegationRequest()
    totalDelegationReq.setDelegatorAddress(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'TotalDelegation',
      totalDelegationReq,
      new TotalDelegationResponse()
    )

    return {
      amount: result.getAmount() ? unmarshalBigUIntPB(result.getAmount()!) : new BN(0),
      weightedAmount: result.getWeightedAmount()
        ? unmarshalBigUIntPB(result.getWeightedAmount()!)
        : new BN(0)
    } as ITotalDelegation
  }

  async checkDelegationAsync(validator: Address, delegator: Address): Promise<IDelegation | null> {
    const checkDelegationReq = new CheckDelegationRequestV2()
    checkDelegationReq.setValidatorAddress(validator.MarshalPB())
    checkDelegationReq.setDelegatorAddress(delegator.MarshalPB())
    const result = await this.staticCallAsync(
      'CheckDelegation',
      checkDelegationReq,
      new CheckDelegationResponseV2()
    )

    const delegation = result.getDelegation()
    return delegation ? this.getDelegation(delegation) : null
  }

  claimDistributionAsync(withdrawalAddress: Address): Promise<void> {
    const claimDistributionRequest = new ClaimDistributionRequestV2()
    claimDistributionRequest.setWithdrawalAddress(withdrawalAddress.MarshalPB())
    return this.callAsync<void>('ClaimDistribution', claimDistributionRequest)
  }

  registerCandidateAsync(
    pubKey: string,
    fee: BN,
    name: string,
    description: string,
    website: string,
    tier: LockTimeTier
  ): Promise<void> {
    const registerCandidateRequest = new RegisterCandidateRequestV2()
    registerCandidateRequest.setPubKey(pubKey)
    registerCandidateRequest.setFee(fee.toString(10) as any)
    registerCandidateRequest.setName(name)
    registerCandidateRequest.setDescription(description)
    registerCandidateRequest.setWebsite(website)
    registerCandidateRequest.setLocktimeTier(tier)
    return this.callAsync<void>('RegisterCandidate', registerCandidateRequest)
  }

  unregisterCandidateAsync(): Promise<void> {
    const unregisterCandidateRequest = new UnregisterCandidateRequestV2()
    return this.callAsync<void>('UnregisterCandidate', unregisterCandidateRequest)
  }

  delegateAsync(
    validator: Address,
    amount: BN,
    tier: LockTimeTier,
    referrer?: string
  ): Promise<void> {
    const delegateRequest = new DelegateRequestV2()
    delegateRequest.setValidatorAddress(validator.MarshalPB())
    delegateRequest.setAmount(marshalBigUIntPB(amount))
    delegateRequest.setLocktimeTier(tier)
    if (referrer) {
      delegateRequest.setReferrer(referrer)
    }
    return this.callAsync<void>('Delegate2', delegateRequest)
  }

  redelegateAsync(
    oldValidator: Address,
    validator: Address,
    amount: BN,
    referrer?: string
  ): Promise<void> {
    const redelegateRequest = new RedelegateRequestV2()
    redelegateRequest.setFormerValidatorAddress(oldValidator.MarshalPB())
    redelegateRequest.setValidatorAddress(validator.MarshalPB())
    redelegateRequest.setAmount(marshalBigUIntPB(amount))
    if (referrer) {
      redelegateRequest.setReferrer(referrer)
    }
    return this.callAsync<void>('Redelegate', redelegateRequest)
  }

  unbondAsync(validator: Address, amount: BN | number | string): Promise<void> {
    const unbondRequest = new UnbondRequestV2()
    unbondRequest.setValidatorAddress(validator.MarshalPB())
    unbondRequest.setAmount(marshalBigUIntPB(new BN(amount)))
    return this.callAsync<void>('Unbond', unbondRequest)
  }

  private getDelegation(delegation: DelegationV2): IDelegation {
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
      height: new BN(delegation.getHeight()),
      lockTime: delegation.getLockTime(),
      lockTimeTier: delegation.getLocktimeTier(),
      state: delegation.getState()
    }
  }
}
