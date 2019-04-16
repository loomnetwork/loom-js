import BN from 'bn.js'
import debug from 'debug'
import { ethers } from 'ethers'
import Web3 from 'web3'

import { CryptoUtils, Address, Client, Contracts } from '.'
import { Coin, LoomCoinTransferGateway } from './contracts'
import { IWithdrawalReceipt } from './contracts/transfer-gateway'
import { sleep, parseSigs } from './helpers'
import { getMetamaskSigner } from './sign-helpers'

import { CrossChainUser } from './crosschain-user'

const log = debug('gateway-user')

const coinMultiplier = new BN(10).pow(new BN(18))

import { ERC20 } from './mainnet-contracts/ERC20'
import { ValidatorManagerContract } from './mainnet-contracts/ValidatorManagerContract'
import { ERC20Gateway_v2 } from './mainnet-contracts/ERC20Gateway_v2'

const ValidatorManagerContractABI = require('./mainnet-contracts/ValidatorManagerContract.json')
const ERC20GatewayABI = require('./mainnet-contracts/ERC20Gateway.json')
const ERC20GatewayABI_v2 = require('./mainnet-contracts/ERC20Gateway_v2.json')
const ERC20ABI = require('./mainnet-contracts/ERC20.json')

const V2_GATEWAYS = ['oracle-dev', 'asia1']

export enum GatewayVersion {
  SINGLESIG = 1,
  MULTISIG = 2
}

export interface EthereumContracts {
  gateway: ERC20Gateway_v2
  loomToken: ERC20
  vmc?: ValidatorManagerContract
}

export class GatewayUser extends CrossChainUser {
  private _ethereumGateway: ERC20Gateway_v2
  private _ethereumLoom: ERC20
  private _ethereumVMC?: ValidatorManagerContract
  private _dappchainGateway: Contracts.LoomCoinTransferGateway
  private _dappchainLoom: Contracts.Coin
  private _version: GatewayVersion

  static async createGatewayOfflineUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    version?: number
  ): Promise<GatewayUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return GatewayUser.createGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      version
    )
  }

  static async createGatewayMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<GatewayUser> {
    const wallet = getMetamaskSigner(web3.currentProvider)
    return GatewayUser.createGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      version
    )
  }

  static async getContracts(
    wallet: ethers.Signer,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<EthereumContracts> {
    const gatewayABI = version == GatewayVersion.MULTISIG ? ERC20GatewayABI_v2 : ERC20GatewayABI
    const gateway = new ethers.Contract(gatewayAddress, gatewayABI, wallet)
    const loomAddress = await gateway.functions.loomAddress()
    const loomToken = new ethers.Contract(loomAddress, ERC20ABI, wallet)
    let vmc: ethers.Contract
    if (version === GatewayVersion.MULTISIG) {
      const vmcAddress = await gateway.functions.vmc()
      vmc = new ethers.Contract(vmcAddress, ValidatorManagerContractABI, wallet)
    }

    // @ts-ignore
    return { gateway, loomToken, vmc }
  }

  private static getGatewayVersion(
    endpoint: string,
    version?: GatewayVersion
  ): GatewayVersion | undefined {
    // If no gateway version is provided, pick based on the chain URL prefix
    if (version === undefined) {
      const chainName = endpoint.split('.')[0]
      for (let chainPrefix of V2_GATEWAYS) {
        if (chainName.indexOf(chainPrefix) != -1) {
          version = GatewayVersion.MULTISIG
        }
      }
    }

    return version
  }

  static async createEthSignMetamaskGatewayUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<GatewayUser> {
    const gwVersion = GatewayUser.getGatewayVersion(dappchainEndpoint, version)

    let crosschain = await CrossChainUser.createEthSignMetamaskCrossChainUserAsync(
      web3,
      dappchainEndpoint,
      chainId
    )

    const dappchainLoom = await Coin.createAsync(crosschain.client, crosschain.loomAddress)
    const dappchainGateway = await LoomCoinTransferGateway.createAsync(
      crosschain.client,
      crosschain.loomAddress
    )
    const { gateway, loomToken, vmc } = await GatewayUser.getContracts(
      crosschain.wallet,
      gatewayAddress,
      version
    )

    return new GatewayUser(
      crosschain.wallet,
      crosschain.client,
      crosschain.loomAddress,
      crosschain.ethAddress,
      gateway,
      loomToken,
      vmc,
      dappchainGateway,
      dappchainLoom,
      null,
      gwVersion
    )
  }

  static async createGatewayUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    version?: GatewayVersion
  ): Promise<GatewayUser> {
    const gwVersion = GatewayUser.getGatewayVersion(dappchainEndpoint, version)

    let crosschain = await CrossChainUser.createCrossChainUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId
    )

    const dappchainLoom = await Coin.createAsync(crosschain.client, crosschain.loomAddress)
    const dappchainGateway = await LoomCoinTransferGateway.createAsync(
      crosschain.client,
      crosschain.loomAddress
    )
    const { gateway, loomToken, vmc } = await GatewayUser.getContracts(
      wallet,
      gatewayAddress,
      version
    )

    return new GatewayUser(
      wallet,
      crosschain.client,
      crosschain.loomAddress,
      crosschain.ethAddress,
      gateway,
      loomToken,
      vmc,
      dappchainGateway,
      dappchainLoom,
      crosschain.addressMapper,
      gwVersion
    )
  }

  constructor(
    wallet: ethers.Signer,
    client: Client,
    address: Address,
    ethAddress: string,
    gateway: ethers.Contract,
    loomToken: ethers.Contract,
    vmc: ethers.Contract | undefined,
    dappchainGateway: Contracts.LoomCoinTransferGateway,
    dappchainLoom: Contracts.Coin,
    dappchainMapper: Contracts.AddressMapper | null,
    version: GatewayVersion = GatewayVersion.SINGLESIG
  ) {
    super(wallet, client, address, ethAddress, dappchainMapper)

    this._version = version

    // Set ethereum contracts
    // @ts-ignore
    this._ethereumGateway = gateway
    // @ts-ignore
    this._ethereumLoom = loomToken
    // @ts-ignore
    this._ethereumVMC = vmc

    // Set dappchain contracts
    this._dappchainGateway = dappchainGateway
    this._dappchainLoom = dappchainLoom
    this._dappchainGateway = dappchainGateway
  }

  get ethereumVMC(): ethers.Contract | undefined {
    return this._ethereumVMC
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

  /**
   * Deposits funds from mainnet to the gateway
   */
  async depositAsync(amount: BN): Promise<ethers.ContractTransaction> {
    let currentApproval = await this._ethereumLoom.functions.allowance(
      await this.ethAddress,
      this._ethereumGateway.address
    )

    let currentApprovalBN = new BN(currentApproval.toString())

    log('Current approval:', currentApproval)
    if (amount.gt(currentApprovalBN)) {
      let tx = await this._ethereumLoom.functions.approve(
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
    return this.withdrawCoinFromDAppChainGatewayAsync(amount, sig)
  }

  async resumeWithdrawalAsync() {
    const receipt = await this.getPendingWithdrawalReceiptAsync()
    if (receipt === null) {
      log('No pending receipt')
      return
    }
    const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)
    const amount = receipt.tokenAmount!
    return this.withdrawCoinFromDAppChainGatewayAsync(amount, signature)
  }

  async getPendingWithdrawalReceiptAsync(): Promise<IWithdrawalReceipt | null> {
    return this._dappchainGateway.withdrawalReceiptAsync(this.loomAddress)
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
    const addr = this.prefixAddress(address)
    const balance = await this._dappchainLoom.getBalanceOfAsync(addr)
    return balance
  }

  /**
   * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
   *
   * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
   */
  private async depositCoinToDAppChainGatewayAsync(amount: BN): Promise<string> {
    let pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
    let signature: Uint8Array
    if (pendingReceipt === null) {
      await this._dappchainLoom.approveAsync(this._dappchainGateway.address, amount)
      const ethereumAddressStr = await this.ethAddress
      const ethereumAddress = Address.fromString(`eth:${ethereumAddressStr}`)
      const _ethereumLoomCoinAddress = Address.fromString(`eth:${this._ethereumLoom.address}`)
      await this._dappchainGateway.withdrawLoomCoinAsync(
        amount,
        _ethereumLoomCoinAddress,
        ethereumAddress
      )
      log(`${amount.div(coinMultiplier).toString()} tokens deposited to DAppChain Gateway...`)
      while (pendingReceipt === null || pendingReceipt.oracleSignature === null) {
        pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
        await sleep(2000)
      }
    }
    signature = pendingReceipt.oracleSignature

    return CryptoUtils.bytesToHexAddr(signature)
  }

  async getUnclaimedLoomTokensAsync(owner?: string): Promise<BN> {
    const address = owner
      ? Address.fromString(`eth:${owner}`)
      : Address.fromString(`eth:${this.ethAddress}`)
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

  private async withdrawCoinFromDAppChainGatewayAsync(
    amount: BN,
    sig: string
  ): Promise<ethers.ContractTransaction> {
    if (this._version === GatewayVersion.MULTISIG && this._ethereumVMC !== undefined) {
      const hash = await this.createWithdrawalHash(amount)
      const validators = await this._ethereumVMC!.functions.getValidators()
      const { vs, rs, ss, valIndexes } = parseSigs(sig, hash, validators)

      return this._ethereumGateway.functions.withdrawERC20(
        amount.toString(),
        this._ethereumLoom.address,
        valIndexes,
        vs,
        rs,
        ss
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
  prefixAddress(address: string) {
    return Address.fromString(`${this.client.chainId}:${address}`)
  }
}
