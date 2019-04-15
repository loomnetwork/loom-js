import debug from 'debug'
import { ethers } from 'ethers'
import Web3 from 'web3'

import { createDefaultClient, createDefaultEthSignClientAsync } from './helpers'
import { Address, LocalAddress, Client, Contracts, EthersSigner } from '.'

import { AddressMapper } from './contracts/address-mapper'
import { getMetamaskSigner } from './solidity-helpers'

const log = debug('crosschain-user')

export class CrossChainUser {
  private _wallet: ethers.Signer
  private _client: Client
  private _address: Address
  private _ethAddress: string
  private _dappchainMapper: Contracts.AddressMapper | null

  static async createOfflineCrossChainUserAsync(
    endpoint: string,
    privateKey: string,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string
  ): Promise<CrossChainUser> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return CrossChainUser.createCrossChainUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId
    )
  }

  static async createMetamaskCrossChainUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string
  ): Promise<CrossChainUser> {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const wallet = provider.getSigner()
    return CrossChainUser.createCrossChainUserAsync(
      wallet,
      dappchainEndpoint,
      dappchainKey,
      chainId
    )
  }

  static async createEthSignMetamaskCrossChainUserAsync(
    web3: Web3,
    dappchainEndpoint: string,
    chainId: string
  ): Promise<CrossChainUser> {
    const wallet = getMetamaskSigner(web3.currentProvider)

    const { client, callerAddress } = await createDefaultEthSignClientAsync(
      dappchainEndpoint,
      chainId,
      wallet
    )
    const ethAddress = callerAddress.local.toString()
    const mapper = await AddressMapper.createAsync(client, callerAddress)
    const mapping = await mapper.getMappingAsync(callerAddress)
    const dappchainAddress = mapping.to

    return new CrossChainUser(wallet, client, dappchainAddress, ethAddress, null)
  }

  static async createCrossChainUserAsync(
    wallet: ethers.Signer,
    dappchainEndpoint: string,
    dappchainKey: string,
    chainId: string
  ): Promise<CrossChainUser> {
    const { client, publicKey } = createDefaultClient(dappchainKey, dappchainEndpoint, chainId)
    const dappchainAddress = new Address(chainId, LocalAddress.fromPublicKey(publicKey))
    const ethAddress = await wallet.getAddress()
    const dappchainMapper = await AddressMapper.createAsync(client, dappchainAddress)

    return new CrossChainUser(wallet, client, dappchainAddress, ethAddress, dappchainMapper)
  }

  constructor(
    wallet: ethers.Signer,
    client: Client,
    address: Address,
    ethAddress: string,
    dappchainMapper: Contracts.AddressMapper | null
  ) {
    this._wallet = wallet
    this._address = address
    this._ethAddress = ethAddress
    this._client = client
    this._dappchainMapper = dappchainMapper
  }

  get client(): Client {
    return this._client
  }

  get wallet(): ethers.Signer {
    return this._wallet
  }

  get addressMapper(): Contracts.AddressMapper | null {
    return this._dappchainMapper
  }

  get ethAddress(): string {
    return this._ethAddress
  }

  get loomAddress(): Address {
    return this._address
  }

  disconnect() {
    this.client.disconnect()
  }

  /**
   * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
   *
   * @param account The user's account object
   * @param wallet The User's ethers wallet
   */
  async mapAccountsAsync() {
    if (this._dappchainMapper === null) {
      throw new Error(`Tried to map accounts with nil address mapper`)
    }
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
}
