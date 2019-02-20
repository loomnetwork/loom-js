import BN from 'bn.js'
import debug from 'debug'
import { ethers, utils } from 'ethers'
import Web3 from 'web3'

import { CryptoUtils, Address, LocalAddress, Client, Contracts } from '.'
import { Coin, LoomCoinTransferGateway } from './contracts'
import { IWithdrawalReceipt } from './contracts/transfer-gateway'
import { sleep } from './helpers'

import { CrossChain } from './crosschain'

const log = debug('dpos-user')

const coinMultiplier = new BN(10).pow(new BN(18))

import { ERC20Gateway } from './mainnet-contracts/ERC20Gateway'
import { ERC20 } from './mainnet-contracts/ERC20'

const ERC20GatewayABI = require('./mainnet-contracts/ERC20.json')
const ERC20ABI = require('./mainnet-contracts/ERC20.json')

export class GatewayUser extends CrossChain {
  private _ethereumGateway: ERC20Gateway
  private _ethereumLoom: ERC20
  private _dappchainGateway: Contracts.LoomCoinTransferGateway
  private _dappchainLoom: Contracts.Coin

  static async createGatewayOfflineUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<GatewayUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return GatewayUser.createGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress
    )
  }

  static async createGatewayMetamaskUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<GatewayUser> {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const wallet = provider.getSigner()
    return GatewayUser.createGatewayUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId,
      gatewayAddress,
      loomAddress
    )
  }

  static async createGatewayUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string,
    gatewayAddress: string,
    loomAddress: string
  ): Promise<GatewayUser> {
    let crosschain = await CrossChain.createUserAsync(
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
    return new GatewayUser(
      wallet,
      crosschain.client,
      crosschain.loomAddress,
      crosschain.ethAddress,
      gatewayAddress,
      loomAddress,
      dappchainGateway,
      dappchainLoom,
      crosschain.addressMapper
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
    dappchainMapper: Contracts.AddressMapper
  ) {
    super(wallet, client, address, ethAddress, dappchainMapper)

    this._ethereumGateway = new ERC20Gateway(gatewayAddress, ERC20GatewayABI, wallet)
    this._ethereumLoom = new ERC20(loomAddress, ERC20ABI, wallet)
    this._dappchainGateway = dappchainGateway
    this._dappchainLoom = dappchainLoom
    this._dappchainGateway = dappchainGateway
  }

  get ethereumGateway(): ERC20Gateway {
    return this._ethereumGateway
  }

  get ethereumLoom(): ERC20 {
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
    const sigs = await this.depositCoinToDAppChainGatewayAsync(amount)
    return this.withdrawCoinFromRinkebyGatewayAsync(amount, sigs)
  }

  async resumeWithdrawalAsync() {
    const receipt = await this.getPendingWithdrawalReceiptAsync()
    if (receipt === null) {
      log('No pending receipt')
      return
    }
    const amount = receipt.tokenAmount!
    return this.withdrawCoinFromRinkebyGatewayAsync(amount, receipt.sigs)
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

    const pubKey = CryptoUtils.B64ToUint8Array(address)
    const callerAddress = new Address(this.client.chainId, LocalAddress.fromPublicKey(pubKey))
    const balance = await this._dappchainLoom.getBalanceOfAsync(callerAddress)
    return balance
  }

  disconnect() {
    this.client.disconnect()
  }

  /**
   * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
   *
   * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
   */
  private async depositCoinToDAppChainGatewayAsync(amount: BN): Promise<Array<utils.Signature>> {
    let pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
    let signature: Array<utils.Signature>
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
      while (pendingReceipt === null || pendingReceipt.sigs === null) {
        pendingReceipt = await this.getPendingWithdrawalReceiptAsync()
        await sleep(2000)
      }
    }
    signature = pendingReceipt.sigs

    return signature
  }

  private async withdrawCoinFromRinkebyGatewayAsync(
    amount: BN,
    sigs: Array<utils.Signature>
  ): Promise<ethers.ContractTransaction> {
    let vs: Array<number>
    let rs: Array<string>
    let ss: Array<string>
    for (let i  in sigs) {
      vs.push(sigs[i].v)
      rs.push(sigs[i].r)
      ss.push(sigs[i].s)
    }
    this._ethereumLoom.address
    return this._ethereumGateway.functions.withdrawERC20(
      amount.toString(),
      this._ethereumLoom.address,
      // @ts-ignore
      sig.validatorIndexes,
      vs,
      rs,
      ss
    )
  }
}
