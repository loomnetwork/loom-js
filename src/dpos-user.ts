import BN from 'bn.js'
import debug from 'debug'
import { ethers, ContractTransaction } from 'ethers'
import Web3 from 'web3'

import { CryptoUtils, Address, Client, Contracts, EthersSigner } from '.'
import { DPOS2, Coin, LoomCoinTransferGateway, AddressMapper } from './contracts'
import { IWithdrawalReceipt } from './contracts/transfer-gateway'
import { sleep, createDefaultClient } from './helpers'
import {
  IValidator,
  ICandidate,
  IDelegation,
  LockTimeTier,
  ITotalDelegation,
  ICandidateDelegations,
  IDelegatorDelegations
} from './contracts/dpos2'

const log = debug('dpos-user')

const coinMultiplier = new BN(10).pow(new BN(18))
const V2_GATEWAYS = ['oracle-dev', 'asia1']

const ERC20ABI = require('./mainnet-contracts/ERC20.json')
const ERC20GatewayABI = require('./mainnet-contracts/ERC20Gateway.json')
const ERC20GatewayABI_v2 = require('./mainnet-contracts/ERC20Gateway_v2.json')

import { ERC20 } from './mainnet-contracts/ERC20'
import { ERC20Gateway_v2 } from './mainnet-contracts/ERC20Gateway_v2'

export class DPOSUser {
  private _wallet: ethers.Signer
  private _client: Client
  private _address: Address
  private _ethAddress: string
  private _ethereumGateway: ERC20Gateway_v2
  private _ethereumLoom: ERC20
  private _dappchainGateway: Contracts.LoomCoinTransferGateway
  private _dappchainLoom: Contracts.Coin
  private _dappchainDPOS: Contracts.DPOS2
  private _dappchainMapper: Contracts.AddressMapper
  private _version: number

  static async createOfflineUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
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
      version
    )
  }

  static async createMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string,
    version?: number
  ): Promise<DPOSUser> {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const wallet = provider.getSigner()
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress,
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
    version?: number
  ): Promise<DPOSUser> {
    // If no gateway version is provided, pick based on the chain URL prefix
    if (version === undefined) {
      const chainName = dappchainEndpoint.split('.')[0]
      for (let chainPrefix of V2_GATEWAYS) {
        if (chainName.indexOf(chainPrefix) != -1) {
          version = 2
        }
      }
    }

    const { client, address } = createDefaultClient(dappchainKey, dappchainEndpoint, chainId)
    const ethAddress = await wallet.getAddress()

    const dappchainLoom = await Coin.createAsync(client, address)
    log('Connected to dappchain Loom Token')
    const dappchainGateway = await LoomCoinTransferGateway.createAsync(client, address)
    log('Connected to dappchain Gateway Contract')
    const dappchainMapper = await AddressMapper.createAsync(client, address)
    log('Connected to dappchain Address Mapoper contract')
    const dappchainDPOS = await DPOS2.createAsync(client, address)
    log('Connected to dappchain DPOS Contract')
    return new DPOSUser(
      wallet,
      client,
      address,
      ethAddress,
      gatewayAddress,
      loomAddress,
      dappchainGateway,
      dappchainLoom,
      dappchainDPOS,
      dappchainMapper,
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
    dappchainMapper: Contracts.AddressMapper,
    version: number = 1
  ) {
    this._version = version
    this._wallet = wallet
    this._address = address
    this._ethAddress = ethAddress
    this._client = client
    const gatewayABI = version == 2 ? ERC20GatewayABI_v2 : ERC20GatewayABI
    // @ts-ignore
    this._ethereumGateway = new ethers.Contract(gatewayAddress, gatewayABI, wallet)
    // @ts-ignore
    this._ethereumLoom = new ethers.Contract(loomAddress, ERC20ABI, wallet)
    this._dappchainGateway = dappchainGateway
    this._dappchainLoom = dappchainLoom
    this._dappchainDPOS = dappchainDPOS
    this._dappchainMapper = dappchainMapper
  }

  get ethereumGateway(): ethers.Contract {
    return this._ethereumGateway
  }

  get ethereumLoom(): ethers.Contract {
    return this._ethereumLoom
  }

  get dappchainLoom(): Contracts.Coin {
    return this._dappchainLoom
  }

  get dappchainGateway(): Contracts.LoomCoinTransferGateway {
    return this._dappchainGateway
  }

  get dappchainDPOS(): Contracts.DPOS2 {
    return this._dappchainDPOS
  }

  get addressMapper(): Contracts.AddressMapper {
    return this._dappchainMapper
  }

  get ethAddress(): string {
    return this._ethAddress
  }

  get loomAddress(): Address {
    return this._address
  }

  /**
   * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
   *
   * @param account The user's account object
   * @param wallet The User's ethers wallet
   */
  async mapAccountsAsync() {
    const walletAddress = await this._wallet.getAddress()
    const ethereumAddress = Address.fromString(`eth:${walletAddress}`)
    if (await this._dappchainMapper.hasMappingAsync(this._address)) {
      log(`${this._address.toString()} is already mapped`)
      return
    }
    const signer = new EthersSigner(this._wallet)
    await this._dappchainMapper.addIdentityMappingAsync(this._address, ethereumAddress, signer)
    log(`Mapped ${this._address} to ${ethereumAddress}`)
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
    const address = delegator ? this.prefixAddress(delegator) : this._address
    return this._dappchainDPOS.checkDelegatorDelegations(address)
  }

  getTimeUntilElectionsAsync(): Promise<BN> {
    return this._dappchainDPOS.getTimeUntilElectionAsync()
  }

  /**
   * Deposits funds from mainnet to the gateway
   */
  async depositAsync(amount: BN): Promise<ethers.ContractTransaction> {
    let currentApproval = await this._ethereumLoom.functions.allowance(
      await this._wallet.getAddress(),
      this._ethereumGateway.address
    )
    let currentApprovalBN = new BN(currentApproval.toString())

    log('Current approval:', currentApproval)
    if (amount.gt(currentApprovalBN)) {
      let tx: ContractTransaction = await this._ethereumLoom.functions.approve(
        this._ethereumGateway.address,
        amount.sub(currentApprovalBN).toString()
      )
      await tx.wait()
      log('Approved an extra', amount.sub(currentApprovalBN))
    }
    return this._ethereumGateway.functions.depositERC20(
      amount.toString(),
      this._ethereumLoom.address
    )
  }

  /**
   * Withdraw funds from the gateway to mainnet
   */
  async withdrawAsync(amount: BN): Promise<ethers.ContractTransaction> {
    const sig = await this.depositCoinToDAppChainGatewayAsync(amount)
    return this.withdrawCoinFromRinkebyGatewayAsync(amount, sig)
  }

  async resumeWithdrawalAsync() {
    const receipt = await this.getPendingWithdrawalReceiptAsync()
    if (receipt === null) {
      log('No pending receipt')
      return
    }
    log('Got receipt:', receipt)
    const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)
    const amount = receipt.tokenAmount!
    return this.withdrawCoinFromRinkebyGatewayAsync(amount, signature)
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
    const address = withdrawalAddress ? this.prefixAddress(withdrawalAddress) : this._address
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
    const delegatorAddress = delegator ? this.prefixAddress(delegator) : this._address
    return this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress)
  }

  /**
   * Returns the total stake a delegator has delegated to all validators
   *
   * @param delegator The delegator's hex address. If not supplied, will use the current account as a delegator.
   */
  async getTotalDelegationAsync(delegator?: string): Promise<ITotalDelegation | null> {
    const delegatorAddress = delegator ? this.prefixAddress(delegator) : this._address
    return this._dappchainDPOS.totalDelegationAsync(delegatorAddress)
  }

  async getPendingWithdrawalReceiptAsync(): Promise<IWithdrawalReceipt | null> {
    return this._dappchainGateway.withdrawalReceiptAsync(this._address)
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
      return this._dappchainLoom.getBalanceOfAsync(this._address)
    }
    const addr = this.prefixAddress(address)
    const balance = await this._dappchainLoom.getBalanceOfAsync(addr)
    return balance
  }

  disconnect() {
    this._client.disconnect()
  }

  async getUnclaimedLoomTokensAsync(owner?: string): Promise<BN> {
    const address = owner ? Address.fromString(`eth:${owner}`) : Address.fromString(`eth:${this.ethAddress}`)
    const tokens = await this._dappchainGateway.getUnclaimedTokensAsync(address)

    const unclaimedLoomTokens = tokens.filter(
      t => t.tokenContract.local.toString() === this.ethereumLoom.address
    )

    // There is only 1 LOOM token and there's only 1 balance for it:
    // All other parameters of UnclaimedToken are for ERC721(x) tokens.
    let amount
    if (unclaimedLoomTokens.length === 0) {
      // no unclaimed tokens
      amount = new BN(0)
    } else {
      // if the amounts array was set
      const amounts = unclaimedLoomTokens[0].tokenAmounts!
      amount = amounts ? amounts[0] : new BN(0)
    }

    return amount
  }

  /**
   * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
   *
   * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
   */
  private async depositCoinToDAppChainGatewayAsync(amount: BN) {
    let pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
    let signature
    if (pendingReceipt === null) {
      await this._dappchainLoom.approveAsync(this._dappchainGateway.address, amount)
      const ethereumAddressStr = await this._wallet.getAddress()
      const ethereumAddress = Address.fromString(`eth:${ethereumAddressStr}`)
      const _ethereumLoomCoinAddress = Address.fromString(`eth:${this._ethereumLoom.address}`)
      await this._dappchainGateway.withdrawLoomCoinAsync(
        amount,
        _ethereumLoomCoinAddress,
        ethereumAddress
      )
      log(`${amount.div(coinMultiplier).toString()} tokens deposited to DAppChain Gateway...`)
      while (pendingReceipt === null || pendingReceipt.oracleSignature.length === 0) {
        pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
        await sleep(2000)
      }
    }
    signature = pendingReceipt.oracleSignature

    log('Got receipt', pendingReceipt)
    return CryptoUtils.bytesToHexAddr(signature)
  }

  private async withdrawCoinFromRinkebyGatewayAsync(
    amount: BN,
    sig: string
  ): Promise<ethers.ContractTransaction> {
    const hash = await this.createWithdrawalHash(amount)
    log('Receipt hash:', hash)

    if (this._version === 2) {
      // Ugly hack to extract the 'mode' bit from the old signature format - if it's still used (68 = 66 + 2, where 2 is the 0x)
      sig = sig.length === 134 ? '0x' + sig.slice(4) : sig
      let sign = ethers.utils.splitSignature(sig)

      let signer = ethers.utils.recoverAddress(
        ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(hash))),
        sign
      )
      log('Receipt was signed by:', signer)

      let valIndexes = [0]
      return this._ethereumGateway.functions.withdrawERC20(
        amount.toString(),
        this._ethereumLoom.address,
        valIndexes,
        [sign.v!],
        [sign.r],
        [sign.s]
      )
    }

    // @ts-ignore
    return this._ethereumGateway.functions.withdrawERC20(
      amount.toString(),
      sig,
      this._ethereumLoom.address
    )
  }

  private async createWithdrawalHash(amount: BN): Promise<string> {
    let nonce = await this.ethereumGateway.functions.nonces(this.ethAddress)
    let amountHashed = ethers.utils.solidityKeccak256(
      ['uint256', 'address'],
      [amount.toString(), this.ethereumLoom.address]
    )

    const msg = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'address', 'bytes32'],
      [this.ethAddress, nonce, this.ethereumGateway.address, amountHashed]
    )

    return msg
  }

  /**
   * Helper function to prefix an address with the chainId to get chainId:address format
   */
  private prefixAddress(address: string) {
    return Address.fromString(`${this._client.chainId}:${address}`)
  }
}
