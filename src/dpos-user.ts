import BN from 'bn.js'
import debug from 'debug'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { LocalAddress, Address, Client, Contracts } from '.'
import { DPOS2 } from './contracts'
import { createDefaultClient } from './helpers'
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
import { getMetamaskSigner } from './solidity-helpers'
import { EthereumGatewayV2 as EthereumGatewayV2Contract } from './mainnet-contracts/EthereumGatewayV2'
import { ERC20 } from './mainnet-contracts/ERC20'
import { ValidatorManagerV2 as ValidatorManagerV2Contract } from './mainnet-contracts/ValidatorManagerV2'

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
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      version
    )
  }

  static createMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const wallet = getMetamaskSigner(web3.currentProvider)
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      version
    )
  }

  static async createEthSignMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const gatewayUser = await GatewayUser.createEthSignMetamaskGatewayUserAsync({
      web3,
      dappchainEndpoint,
      chainId,
      gatewayAddress,
      version: version ? version : 1
    })

    const dappchainEthAddress = new Address(
      'eth',
      LocalAddress.fromHexString(gatewayUser.ethAddress)
    )
    const dappchainDPOS = await DPOS2.createAsync(gatewayUser.client, dappchainEthAddress)
    log('Connected to dappchain DPOS Contract')

    return new DPOSUser(
      gatewayUser.wallet,
      gatewayUser.client,
      gatewayUser.loomAddress,
      gatewayUser.ethAddress,
      gatewayUser.ethereumGateway,
      gatewayUser.ethereumLoom,
      gatewayUser.ethereumVMC,
      gatewayUser.dappchainGateway,
      gatewayUser.dappchainLoom,
      dappchainDPOS,
      null,
      version
    )
  }

  static async createUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<DPOSUser> {
    const gatewayUser = await GatewayUser.createGatewayUserAsync({
      wallet,
      dappchainEndpoint,
      dappchainPrivateKey: dappchainKey,
      chainId,
      gatewayAddress,
      version: version ? version : 1
    })

    const { client, address } = createDefaultClient(dappchainKey, dappchainEndpoint, chainId)
    const dappchainDPOS = await DPOS2.createAsync(client, address)
    log('Connected to dappchain DPOS Contract')
    return new DPOSUser(
      gatewayUser.wallet,
      gatewayUser.client,
      gatewayUser.loomAddress,
      gatewayUser.ethAddress,
      gatewayUser.ethereumGateway,
      gatewayUser.ethereumLoom,
      gatewayUser.ethereumVMC,
      gatewayUser.dappchainGateway,
      gatewayUser.dappchainLoom,
      dappchainDPOS,
      gatewayUser.addressMapper!,
      version
    )
  }

  constructor(
    wallet: ethers.Signer,
    client: Client,
    loomAddress: Address,
    ethAddress: string,
    gateway: EthereumGatewayV2Contract,
    loomToken: ERC20,
    vmc: ValidatorManagerV2Contract | undefined,
    dappchainGateway: Contracts.LoomCoinTransferGateway,
    dappchainLoom: Contracts.Coin,
    dappchainDPOS: Contracts.DPOS2,
    dappchainMapper: Contracts.AddressMapper | null,
    version: GatewayVersion = 1
  ) {
    super({
      wallet,
      client,
      loomAddress,
      ethAddress,
      gateway,
      loomToken,
      vmc,
      dappchainGateway,
      dappchainLoom,
      addressMapper: dappchainMapper!,
      version
    })
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
    const address = owner ? this.prefixAddress(owner) : this.loomAddress
    return this._dappchainDPOS.checkDistributionAsync(address)
  }
}
