import BN from 'bn.js'
import debug from 'debug'
import { ethers, ContractTransaction } from 'ethers'
import Web3 from 'web3'

import {
  CryptoUtils,
  Address,
  LocalAddress,
  Client,
  createJSONRPCClient,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Contracts,
  EthersSigner
} from '..'
import { JSONRPCProtocol } from '../internal/json-rpc-client'
import { DPOS2, Coin, LoomCoinTransferGateway, AddressMapper } from '../contracts'
import { IWithdrawalReceipt } from '../contracts/transfer-gateway'
import { sleep } from '../helpers'
import {
  IValidator,
  ICandidate,
  IDelegation,
  LockTimeTier,
  ITotalDelegation,
  ICandidateDelegations,
  IDelegatorDelegations
} from '../contracts/dpos2'
import { selectProtocol } from '../rpc-client-factory'
import { overrideReadUrl } from '../client'

const log = debug('dpos-user')

const coinMultiplier = new BN(10).pow(new BN(18))
const ERC20Gateway = require('./contracts/ERC20Gateway.json')
const ERC20 = require('./contracts/ERC20.json')

export class DPOSUser {
  private _wallet: ethers.Signer
  private _client: Client
  private _address: Address
  private _ethAddress: string
  private _ethereumGateway: ethers.Contract
  private _ethereumLoom: ethers.Contract
  private _dappchainGateway: Contracts.LoomCoinTransferGateway
  private _dappchainLoom: Contracts.Coin
  private _dappchainDPOS: Contracts.DPOS2
  private _dappchainMapper: Contracts.AddressMapper

  static async createOfflineUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<DPOSUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress
    )
  }

  static async createMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<DPOSUser> {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const wallet = provider.getSigner()
    return DPOSUser.createUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress
    )
  }

  static async createUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<DPOSUser> {
    const privateKey = CryptoUtils.B64ToUint8Array(dappchainKey)
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    const protocol = selectProtocol(dappchainEndpoint)
    const writerSuffix = protocol == JSONRPCProtocol.HTTP ? '/rpc' : '/websocket'
    const readerSuffix = protocol == JSONRPCProtocol.HTTP ? '/query' : '/queryws'

    const writer = createJSONRPCClient({
      protocols: [{ url: dappchainEndpoint + writerSuffix }]
    })
    const reader = createJSONRPCClient({
      protocols: [{ url: overrideReadUrl(dappchainEndpoint + readerSuffix) }]
    })

    const client = new Client(chainId, writer, reader)
    log('Initialized', dappchainEndpoint)
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    client.on('error', (msg: any) => {
      log('PlasmaChain connection error', msg)
    })

    const address = new Address(chainId, LocalAddress.fromPublicKey(publicKey))
    const ethAddress = await wallet.getAddress()

    const dappchainLoom = await Coin.createAsync(client, address)
    const dappchainDPOS = await DPOS2.createAsync(client, address)
    const dappchainGateway = await LoomCoinTransferGateway.createAsync(client, address)
    const dappchainMapper = await AddressMapper.createAsync(client, address)
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
      dappchainMapper
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
    dappchainMapper: Contracts.AddressMapper
  ) {
    this._wallet = wallet
    this._address = address
    this._ethAddress = ethAddress
    this._client = client
    this._ethereumGateway = new ethers.Contract(gatewayAddress, ERC20Gateway, wallet)
    this._ethereumLoom = new ethers.Contract(loomAddress, ERC20, wallet)
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

  listDelegatorDelegations(delegator: string): Promise<IDelegatorDelegations> {
    const address = this.prefixAddress(delegator)
    return this._dappchainDPOS.checkDelegatorDelegations(address)
  }


  getTimeUntilElectionsAsync(): Promise<BN> {
    return this._dappchainDPOS.getTimeUntilElectionAsync()
  }

  /**
   * Deposits funds from mainnet to the gateway
   */
  async depositAsync(amount: BN): Promise<ethers.ContractTransaction> {
    let currentApproval = await this._ethereumLoom.allowance(
      await this._wallet.getAddress(),
      this._ethereumGateway.address
    )
    currentApproval = new BN(currentApproval._hex.split('0x')[1], 16) // ugly way to convert the BN

    log('Current approval:', currentApproval)
    if (amount.gt(currentApproval)) {
      let tx: ContractTransaction = await this._ethereumLoom.approve(
        this._ethereumGateway.address,
        amount.sub(currentApproval).toString()
      )
      await tx.wait()
      log('Approved an extra', amount.sub(currentApproval))
    }
    return this._ethereumGateway.depositERC20(amount.toString(), this._ethereumLoom.address)
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

    const pubKey = CryptoUtils.B64ToUint8Array(address)
    const callerAddress = new Address(this._client.chainId, LocalAddress.fromPublicKey(pubKey))
    const balance = await this._dappchainLoom.getBalanceOfAsync(callerAddress)
    return balance
  }

  disconnect() {
    this._client.disconnect()
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

    return CryptoUtils.bytesToHexAddr(signature)
  }

  private async withdrawCoinFromRinkebyGatewayAsync(
    amount: BN,
    sig: string
  ): Promise<ethers.ContractTransaction> {
    return this._ethereumGateway.withdrawERC20(amount.toString(), sig, this._ethereumLoom.address)
  }

  /**
   * Helper function to prefix an address with the chainId to get chainId:address format
   */
  private prefixAddress(address: string) {
    return Address.fromString(`${this._client.chainId}:${address}`)
  }
}
