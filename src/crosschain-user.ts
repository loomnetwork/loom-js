import debug from 'debug'
import { ethers } from 'ethers'
import Web3 from 'web3'

import { createDefaultClient, createDefaultEthSignClientAsync } from './helpers'
import { Address, LocalAddress, Client, Contracts, EthersSigner } from '.'

import { AddressMapper } from './contracts/address-mapper'
import { getMetamaskSigner } from './solidity-helpers'

const log = debug('crosschain-user')

export interface CrossChainUserParams {
  // Dappchain endpoint settings
  dappchainEndpoint: string
  chainId: string

  // Keys
  dappchainPrivateKey?: string
  ethereumPrivateKey?: string

  // Ethereum endpoint settings
  web3?: Web3
  ethEndpoint?: string
  wallet?: ethers.Signer
}

export interface NewCrossChainUserParams {
  wallet: ethers.Signer
  client: Client
  address: Address
  ethAddress: string
  addressMapper?: Contracts.AddressMapper
}

export class CrossChainUser {
  private _wallet: ethers.Signer
  private _client: Client
  private _address: Address
  private _ethAddress: string
  private _dappchainMapper?: Contracts.AddressMapper

  static async createOfflineCrossChainUserAsync(
    params: CrossChainUserParams
  ): Promise<CrossChainUser> {
    const provider = new ethers.providers.JsonRpcProvider(params.ethEndpoint)
    const wallet = new ethers.Wallet(params.ethereumPrivateKey!, provider)
    return CrossChainUser.createCrossChainUserAsync({
      wallet,
      ...params
    })
  }

  static async createMetamaskCrossChainUserAsync(
    params: CrossChainUserParams
  ): Promise<CrossChainUser> {
    const provider = new ethers.providers.Web3Provider(params.web3!.currentProvider)
    const wallet = provider.getSigner()
    return CrossChainUser.createCrossChainUserAsync({
      wallet,
      ...params
    })
  }

  static async createEthSignMetamaskCrossChainUserAsync(
    params: CrossChainUserParams
  ): Promise<CrossChainUser> {
    const wallet = getMetamaskSigner(params.web3!.currentProvider)

    const { client, callerAddress } = await createDefaultEthSignClientAsync(
      params.dappchainEndpoint,
      params.chainId,
      wallet
    )
    const ethAddress = callerAddress.local.toString()
    const mapper = await AddressMapper.createAsync(client, callerAddress)
    const mapping = await mapper.getMappingAsync(callerAddress)
    const address = mapping.to

    return new CrossChainUser({ wallet, client, address, ethAddress })
  }

  static async createCrossChainUserAsync(params: CrossChainUserParams): Promise<CrossChainUser> {
    const { client, publicKey } = createDefaultClient(
      params.dappchainPrivateKey!,
      params.dappchainEndpoint,
      params.chainId
    )
    const address = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
    const ethAddress = await params.wallet!.getAddress()
    const addressMapper = await AddressMapper.createAsync(client, address)

    return new CrossChainUser({
      wallet: params.wallet!,
      client,
      address,
      ethAddress,
      addressMapper
    })
  }

  constructor(params: NewCrossChainUserParams) {
    this._wallet = params.wallet
    this._address = params.address
    this._ethAddress = params.ethAddress
    this._client = params.client
    this._dappchainMapper = params.addressMapper
  }

  get client(): Client {
    return this._client
  }

  get wallet(): ethers.Signer {
    return this._wallet
  }

  get addressMapper(): Contracts.AddressMapper | undefined {
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
    if (await this._dappchainMapper!.hasMappingAsync(this._address)) {
      log(`${this._address.toString()} is already mapped`)
      return
    }
    const signer = new EthersSigner(this._wallet)
    await this._dappchainMapper!.addIdentityMappingAsync(this._address, ethereumAddress, signer)
    log(`Mapped ${this._address} to ${ethereumAddress}`)
  }
}
