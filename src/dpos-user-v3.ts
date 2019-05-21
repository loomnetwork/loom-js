import BN from 'bn.js'
import debug from 'debug'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { LocalAddress, Address, Client, Contracts } from '.'
import { DPOS3 } from './contracts'
import { createDefaultClient } from './helpers'
import {
  GatewayUser,
  GatewayUserConstructorParams,
  GatewayUserParams,
  GatewayVersion
} from './gateway-user'
import {
  IValidator,
  ICandidate,
  ICandidateDelegations,
  IDelegatorDelegations
} from './contracts/dpos3'
import { getMetamaskSigner } from './solidity-helpers'
import { LocktimeTier, DelegationState } from './proto/dposv3_pb'

const log = debug('dpos3-user')

export interface DPOSUserV3ConstructorParams extends GatewayUserConstructorParams {
  dappchainDPOS: Contracts.DPOS3
}

export class DPOSUserV3 extends GatewayUser {
  private _dappchainDPOS: Contracts.DPOS3

  static async createOfflineUserAsync(params: GatewayUserParams): Promise<DPOSUserV3> {
    const provider = new ethers.providers.JsonRpcProvider(params.ethEndpoint)
    const wallet = new ethers.Wallet(params.ethereumPrivateKey!, provider)
    return DPOSUserV3.createUserAsync({
      wallet,
      ...params
    })
  }

  static createMetamaskUserAsync(params: GatewayUserParams): Promise<DPOSUserV3> {
    const wallet = getMetamaskSigner(params.web3!.currentProvider)
    return DPOSUserV3.createUserAsync({
      wallet,
      ...params
    })
  }

  static async createEthSignMetamaskUserAsync(params: GatewayUserParams): Promise<DPOSUserV3> {
    const gatewayUser = await GatewayUser.createEthSignMetamaskGatewayUserAsync(params)
    const dappchainEthAddress = new Address(
      'eth',
      LocalAddress.fromHexString(gatewayUser.ethAddress)
    )
    const dappchainDPOS = await DPOS3.createAsync(gatewayUser.client, dappchainEthAddress)
    log('Connected to dappchain DPOS Contract')

    return new DPOSUserV3({
      wallet: gatewayUser.wallet,
      client: gatewayUser.client,
      loomAddress: gatewayUser.loomAddress,
      ethAddress: gatewayUser.ethAddress,
      gateway: gatewayUser.ethereumGateway,
      loomToken: gatewayUser.ethereumLoom,
      vmc: gatewayUser.ethereumVMC,
      dappchainGateway: gatewayUser.dappchainGateway,
      dappchainLoom: gatewayUser.dappchainLoom,
      dappchainDPOS,
      version: params.version
    })
  }

  static async createUserAsync(params: GatewayUserParams): Promise<DPOSUserV3> {
    const gatewayUser = await GatewayUser.createGatewayUserAsync(params)
    const dappchainEthAddress = new Address(
      'eth',
      LocalAddress.fromHexString(gatewayUser.ethAddress)
    )
    const dappchainDPOS = await DPOS3.createAsync(gatewayUser.client, dappchainEthAddress)

    log('Connected to dappchain DPOS Contract')
    return new DPOSUserV3({
      wallet: gatewayUser.wallet,
      client: gatewayUser.client,
      loomAddress: gatewayUser.loomAddress,
      ethAddress: gatewayUser.ethAddress,
      gateway: gatewayUser.ethereumGateway,
      loomToken: gatewayUser.ethereumLoom,
      vmc: gatewayUser.ethereumVMC,
      dappchainGateway: gatewayUser.dappchainGateway,
      dappchainLoom: gatewayUser.dappchainLoom,
      addressMapper: gatewayUser.addressMapper,
      dappchainDPOS,
      version: params.version
    })
  }

  constructor(params: DPOSUserV3ConstructorParams) {
    super(params)
    this._dappchainDPOS = params.dappchainDPOS
  }

  get dappchainDPOS(): Contracts.DPOS3 {
    return this._dappchainDPOS
  }

  listValidatorsAsync(): Promise<IValidator[]> {
    return this._dappchainDPOS.getValidatorsAsync()
  }

  listCandidatesAsync(): Promise<ICandidate[]> {
    return this._dappchainDPOS.getCandidatesAsync()
  }

  listAllDelegationsAsync(): Promise<Array<ICandidateDelegations>> {
    return this._dappchainDPOS.getAllDelegations()
  }

  listDelegationsAsync(candidate: string): Promise<ICandidateDelegations> {
    const address = this.prefixAddress(candidate)
    return this._dappchainDPOS.getDelegations(address)
  }

  checkAllDelegationsAsync(delegator?: string): Promise<IDelegatorDelegations> {
    const address = delegator ? this.prefixAddress(delegator) : this.loomAddress
    return this._dappchainDPOS.checkAllDelegationsAsync(address)
  }

  getTimeUntilElectionsAsync(): Promise<BN> {
    return this._dappchainDPOS.getTimeUntilElectionAsync()
  }

  /**
   * Delegates an amount of LOOM tokens to a candidate/validator
   *
   * @param candidate The candidate's hex address
   * @param amount The amount delegated
   */
  async delegateAsync(
    candidate: string,
    amount: BN,
    tier: LocktimeTier,
    referrer?: string
  ): Promise<void> {
    const address = this.prefixAddress(candidate)
    await this.dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)
    return this._dappchainDPOS.delegateAsync(address, amount, tier, referrer)
  }

  /**
   * Redelegates an amount of LOOM tokens from a validator to another
   *
   * @param formerValidator The candidate's hex address
   * @param newValidator The candidate's hex address
   * @param amount The amount delegated
   */
  async redelegateAsync(
    formerValidator: string,
    validator: string,
    amount: BN,
    index: number
  ): Promise<void> {
    const validatorAddress = this.prefixAddress(validator)
    const formerValidatorAddress = this.prefixAddress(formerValidator)
    return this._dappchainDPOS.redelegateAsync(
      formerValidatorAddress,
      validatorAddress,
      amount,
      index
    )
  }

  /**
   * Undelegates an amount of LOOM tokens from a candidate/validator
   *
   * @param candidate The candidate's hex address
   * @param amount The amount to undelegate
   */
  async undelegateAsync(candidate: string, amount: BN, index: number): Promise<void> {
    const address = this.prefixAddress(candidate)
    await this._dappchainDPOS.unbondAsync(address, amount, index)
  }

  /**
   * Returns the stake a delegator has delegated to a candidate/validator
   *
   * @param validator The validator's hex address
   * @param delegator The delegator's hex address
   */
  checkDelegationsAsync(
    validator: string,
    delegator?: string
  ): Promise<IDelegatorDelegations | null> {
    const validatorAddress = this.prefixAddress(validator)
    const delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress
    return this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress)
  }

  claimDelegatorRewardsAsync(): Promise<BN> {
    return this._dappchainDPOS.claimDelegatorRewardsAsync()
  }

  async checkDelegatorRewardsAsync(owner?: string): Promise<BN> {
    const address = owner ? this.prefixAddress(owner) : this.loomAddress
    return this._dappchainDPOS.checkDelegatorRewardsAsync(address)
  }
}
