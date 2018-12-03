import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  ListCandidateRequestV2,
  ListCandidateResponseV2,
  CandidateV2,
  ClaimDistributionRequestV2,
  ListValidatorsRequestV2,
  ListValidatorsResponseV2,
  Validator,
  DelegationOverrideRequestV2,
  DelegateRequestV2,
  UnbondRequestV2,
  CheckDelegationRequestV2,
  CheckDelegationResponseV2,
  RegisterCandidateRequestV2,
  UnregisterCandidateRequestV2
} from '../proto/dposv2_pb'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'

export interface ICandidate {
  pubKey: Uint8Array
  address: Address
  fee: number
  name: string
  description: string
  website: string
}

export interface IValidator {
  pubKey: Uint8Array
  power: number
}

export interface IDelegation {
  validator: Address
  delegator: Address
  height: BN
  amount: BN
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

  async getCandidatesAsync(): Promise<Array<ICandidate>> {
    const listCandidatesReq = new ListCandidateRequestV2()
    const result = await this.staticCallAsync(
      'ListCandidates',
      listCandidatesReq,
      new ListCandidateResponseV2()
    )

    return result.getCandidatesList().map((candidate: CandidateV2) => ({
      pubKey: candidate.getPubKey_asU8()!,
      address: Address.UmarshalPB(candidate.getAddress()!),
      fee: candidate.getFee()!,
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

    return result.getValidatorsList().map((validator: Validator) => ({
      pubKey: validator.getPubKey_asU8()!,
      power: validator.getPower()
    }))
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
    return delegation
      ? {
          validator: Address.UmarshalPB(delegation.getValidator()!),
          delegator: Address.UmarshalPB(delegation.getDelegator()!),
          height: new BN(delegation.getHeight()),
          amount: delegation.getAmount() ? unmarshalBigUIntPB(delegation.getAmount()!) : new BN(0)
        }
      : null
  }

  async claimDistributionAsync(withdrawalAddress: Address): Promise<void> {
    const claimDistributionRequest = new ClaimDistributionRequestV2()
    claimDistributionRequest.setWithdrawalAddress(withdrawalAddress.MarshalPB())
    return this.callAsync<void>('ClaimDistribution', claimDistributionRequest)
  }

  async registerCandidateAsync(
    pubKey: string,
    fee: number,
    name: string,
    description: string,
    website: string
  ): Promise<void> {
    const registerCandidateRequest = new RegisterCandidateRequestV2()
    registerCandidateRequest.setPubKey(pubKey)
    registerCandidateRequest.setFee(fee)
    registerCandidateRequest.setName(name)
    registerCandidateRequest.setDescription(description)
    registerCandidateRequest.setWebsite(website)
    return this.callAsync<void>('RegisterCandidate', registerCandidateRequest)
  }

  async unregisterCandidateAsync(): Promise<void> {
    const unregisterCandidateRequest = new UnregisterCandidateRequestV2()
    return this.callAsync<void>('UnregisterCandidate', unregisterCandidateRequest)
  }

  async delegateAsync(validator: Address, amount: BN | number | string): Promise<void> {
    const delegateRequest = new DelegateRequestV2()
    delegateRequest.setValidatorAddress(validator.MarshalPB())
    delegateRequest.setAmount(marshalBigUIntPB(new BN(amount)))
    return this.callAsync<void>('Delegate', delegateRequest)
  }

  // Super-user only function
  async delegationOverrideAsync(
    validator: Address,
    delegator: Address,
    amount: BN | number | string,
    locktime: number
  ): Promise<void> {
    const delegateOverrideRequest = new DelegationOverrideRequestV2()
    delegateOverrideRequest.setValidatorAddress(validator.MarshalPB())
    delegateOverrideRequest.setDelegatorAddress(delegator.MarshalPB())
    delegateOverrideRequest.setAmount(marshalBigUIntPB(new BN(amount)))
    delegateOverrideRequest.setLockTime(locktime)
    return this.callAsync<void>('DelegationOverride', delegateOverrideRequest)
  }

  async unbondAsync(validator: Address, amount: BN | number | string): Promise<void> {
    const unbondRequest = new UnbondRequestV2()
    unbondRequest.setValidatorAddress(validator.MarshalPB())
    unbondRequest.setAmount(marshalBigUIntPB(new BN(amount)))
    return this.callAsync<void>('Unbond', unbondRequest)
  }
}
