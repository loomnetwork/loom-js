import BN from 'bn.js'

import { CryptoUtils, Address, LocalAddress, Client, Contracts } from '..'

import { DPOS2, Coin } from '../contracts'

import {
  IValidator,
  ICandidate,
  IDelegation,
  LockTimeTier,
  ITotalDelegation
} from '../contracts/dpos2'

import { createClient } from './../helpers'

const coinMultiplier = new BN(10).pow(new BN(18))

export class DPOSUser {
  private _dappchainLoom: Contracts.Coin
  private _dappchainDPOS: Contracts.DPOS2
  private _loomAddress: Address
  private _client: Client

  static async createDPOSUserAsync(
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string
  ): Promise<DPOSUser> {
    const { client, address } = createClient(dappchainKey, dappchainEndpoint, chainId)

    const dappchainDPOS = await DPOS2.createAsync(client, address)
    const dappchainLoom = await Coin.createAsync(client, address)
    return new DPOSUser(dappchainDPOS, dappchainLoom, client, address)
  }

  constructor(
    dappchainDPOS: Contracts.DPOS2,
    dappchainLoom: Contracts.Coin,
    client: Client,
    address: Address
  ) {
    this._dappchainLoom = dappchainLoom
    this._dappchainDPOS = dappchainDPOS
    this._client = client
    this._loomAddress = address
  }

  get client(): Client {
    return this._client
  }

  get loomAddress(): Address {
    return this._loomAddress
  }

  get dappchainLoom(): Contracts.Coin {
    return this._dappchainLoom
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
    await this._dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)
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

  checkRewardsAsync(): Promise<BN> {
    return this._dappchainDPOS.checkDistributionAsync()
  }

  /**
   * Retrieves the  DAppChain LoomCoin balance of a user
   * @param address The address to check the balance of. If not provided, it will check the user's balance
   */
  async getDAppChainBalanceAsync(address: string | undefined): Promise<BN> {
    // if no address is provided, return our balance
    if (address === undefined) {
      return this._dappchainLoom.getBalanceOfAsync(this.loomAddress)
    }

    const pubKey = CryptoUtils.B64ToUint8Array(address)
    const callerAddress = new Address(this.client.chainId, LocalAddress.fromPublicKey(pubKey))
    const balance = await this._dappchainLoom.getBalanceOfAsync(callerAddress)
    return balance
  }

  disconnect() {
    this.client.disconnect()
  }

  /**
   * Helper function to prefix an address with the chainId to get chainId:address format
   */
  private prefixAddress(address: string) {
    return Address.fromString(`${this.client.chainId}:${address}`)
  }
}
