import BN from 'bn.js'
import debug from 'debug'
import { ethers, ContractTransaction } from 'ethers'
import Web3 from 'web3'

import { Address, Client, Contracts } from '.'
import { DPOS2, Coin, LoomCoinTransferGateway, AddressMapper } from './contracts'
import { createDefaultClient, createDefaultEthSignClientAsync } from './helpers'
import { GatewayUser, GatewayVersion } from './gateway-user'

import {
  IValidator,
  ICandidate,
  IDelegation,
  LockTimeTier,
  ITotalDelegation,
  ICandidateDelegations,
  IDelegatorDelegations
} from './contracts/dpos2'

import { LocalAddress } from './address'
import { getMetamaskSigner } from './solidity-helpers'

const log = debug('dpos-user')

export class DPOSUser extends GatewayUser {
  private _dappchainDPOS: Contracts.DPOS2

  static async createOfflineUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
    vmcAddress?: string,
    version?: number
  ): Promise<DPOSUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress,
      vmcAddress,
      version
    )
  }

  static createMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
    vmcAddress?: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const wallet = getMetamaskSigner(web3.currentProvider)
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress,
      vmcAddress,
      version
    )
  }

  static async createEthSignMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
    vmcAddress?: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const wallet = getMetamaskSigner(web3.currentProvider)
    const gatewayUser = await GatewayUser.createEthSignGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      chainId,
      gatewayAddress,
      loomAddress,
      vmcAddress,
      version
    )

    const { client, callerAddress } = await createDefaultEthSignClientAsync(
      dappchainEndpoint,
      chainId,
      wallet
    )

    const dappchainDPOS = await DPOS2.createAsync(client, address)
    log('Connected to dappchain DPOS Contract')
    
    // Get the loom address from the address mapper
    const loomAddress = (await gatewayUser.addressMapper.getMapping(gatewayUser.loomAddress)).to
    return new DPOSUser(
      gatewayUser.wallet,
      gatewayUser.client,
      loomAddress,
      gatewayUser.ethAddress,
      gatewayAddress,
      loomAddress,
      gatewayUser.dappchainGateway,
      gatewayUser.dappchainLoom,
      dappchainDPOS,
      null,
      vmcAddress,
      version
    )
  }

  static async createUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
    vmcAddress?: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const gatewayUser = await GatewayUser.createGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress,
      vmcAddress,
      version
    )

    const { client, address } = createDefaultClient(dappchainKey, dappchainEndpoint, chainId)
    const dappchainDPOS = await DPOS2.createAsync(client, address)
    log('Connected to dappchain DPOS Contract')
    return new DPOSUser(
      gatewayUser.wallet,
      gatewayUser.client,
      gatewayUser.loomAddress,
      gatewayUser.ethAddress,
      gatewayAddress,
      loomAddress,
      gatewayUser.dappchainGateway,
      gatewayUser.dappchainLoom,
      dappchainDPOS,
      gatewayUser.addressMapper,
      vmcAddress,
      version
    )
  }

  constructor(
    wallet: ethers.Signer,
    client: Client,
    address: Address,
    ethAddress: string,
    gatewayAddress: string,
    loomAddress: string,
    dappchainGateway: Contracts.LoomCoinTransferGateway,
    dappchainLoom: Contracts.Coin,
    dappchainDPOS: Contracts.DPOS2,
    dappchainMapper: Contracts.AddressMapper | null,
    vmcAddress?: string,
    version: GatewayVersion = GatewayVersion.SINGLESIG
  ) {
    super(
      wallet,
      client,
      address,
      ethAddress,
      gatewayAddress,
      loomAddress,
      dappchainGateway,
      dappchainLoom,
      dappchainMapper,
      vmcAddress,
      version
    )
    this._dappchainDPOS = dappchainDPOS
  }

  get dappchainDPOS(): Contracts.DPOS2 {
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

  listDelegatorDelegations(delegator?: string): Promise<IDelegatorDelegations> {
    const address = delegator ? this.prefixAddress(delegator) : this.loomAddress
    return this._dappchainDPOS.checkDelegatorDelegations(address)
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
  async delegateAsync(candidate: string, amount: BN, tier: LockTimeTier): Promise<void> {
    const address = this.prefixAddress(candidate)
    await this.dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)
    return this._dappchainDPOS.delegateAsync(address, amount, tier)
  }

  /**
   * Redelegates an amount of LOOM tokens from a validator to another
   *
   * @param formerValidator The candidate's hex address
   * @param newValidator The candidate's hex address
   * @param amount The amount delegated
   */
  async redelegateAsync(formerValidator: string, validator: string, amount: BN): Promise<void> {
    const validatorAddress = this.prefixAddress(validator)
    const formerValidatorAddress = this.prefixAddress(formerValidator)
    return this._dappchainDPOS.redelegateAsync(formerValidatorAddress, validatorAddress, amount)
  }

  /**
   * Undelegates an amount of LOOM tokens from a candidate/validator
   *
   * @param candidate The candidate's hex address
   * @param amount The amount to undelegate
   */
  async undelegateAsync(candidate: string, amount: BN): Promise<void> {
    const address = this.prefixAddress(candidate)
    await this._dappchainDPOS.unbondAsync(address, amount)
  }

  claimDelegationsAsync(withdrawalAddress?: string): Promise<void> {
    const address = withdrawalAddress ? this.prefixAddress(withdrawalAddress) : this.loomAddress
    return this._dappchainDPOS.claimDistributionAsync(address)
  }

  /**
   * Returns the stake a delegator has delegated to a candidate/validator
   *
   * @param validator The validator's hex address
   * @param delegator The delegator's hex address
   */
  checkDelegationsAsync(validator: string, delegator?: string): Promise<IDelegation | null> {
    const validatorAddress = this.prefixAddress(validator)
    const delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress
    return this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress)
  }

  /**
   * Returns the total stake a delegator has delegated to all validators
   *
   * @param delegator The delegator's hex address. If not supplied, will use the current account as a delegator.
   */
  async getTotalDelegationAsync(delegator?: string): Promise<ITotalDelegation | null> {
    const delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress
    return this._dappchainDPOS.totalDelegationAsync(delegatorAddress)
  }

  checkRewardsAsync(owner?: string): Promise<BN> {
    const address = owner ? this.prefixAddress(owner) : this._address
    return this._dappchainDPOS.checkDistributionAsync(address)
  }
}
