import {
  Contracts,
  CryptoUtils,
  Client,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Address,
  LocalAddress
} from './dist'
import BN from 'bn.js'

export default class UserDeployerWhitelistManager {
  static async createAsync() {
    const privateKey = CryptoUtils.B64ToUint8Array(
      'ZGTsP8LUJkEWiqEZq3hqOKfCHCeV+CbYgbZK2/y53aDAaCJPBla4uLTsEtzm/Dczk8Ml8TL5+rAwKNfbuRZihg=='
    )

    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    const client = new Client(
      'default',
      'ws://127.0.0.1:46658/websocket',
      'ws://127.0.0.1:46658/queryws'
    )

    console.log('Client created', client)
      ,
      // required middleware
      client.txMiddleware = [
        new NonceTxMiddleware(publicKey, client),
        new SignedTxMiddleware(privateKey)
      ]

    const userDeployerWhitelist = await Contracts.UserDeployerWhitelist.createAsync(
      client,
      new Address('default', LocalAddress.fromPublicKey(publicKey))
    )
    console.log('Contract created', userDeployerWhitelist)

    return new UserDeployerWhitelistManager(userDeployerWhitelist, client)
  }

  constructor(userDeployerWhitelist, client) {
    this._userDeployerWhitelist = userDeployerWhitelist
    this._client = client
  }


  async addUserDeployerAsync(deployerAddr, tierId) {
    return await this._userDeployerWhitelist.addUserDeployerAsync(
      new Address(this._client.chainId, LocalAddress.fromHexString(deployerAddr)),
      tierId
    )
  }

  async getUserDeployersAsync(userAddr) {
    return await this._userDeployerWhitelist.getUserDeployersAsync(new Address(this._client.chainId, LocalAddress.fromHexString(userAddr)))
  }

  async getDeployedContractsAsync(deployerAddr) {
    return await this._userDeployerWhitelist.getDeployedContractsAsync(
      new Address(this._client.chainId, LocalAddress.fromHexString(deployerAddr))
    )
  }

  async getTierInfoAsync(tierId) {
    return await this._userDeployerWhitelist.getTierInfoAsync(
      tierId
    )
  }

  async setTierInfoAsync(tier, fee, name) {
    return await this._userDeployerWhitelist.setTierInfoAsync(
      tier, fee, name)
  }

}

let tier = { tierId: 0, fee: new BN(100), name: 'Tier1' }

//test
let test = async function() {
  let userDeployerWhitelistManager
  try {
    userDeployerWhitelistManager = await UserDeployerWhitelistManager.createAsync()
    console.log('userDeployerWhitelistManager created')
  } catch (err) {
    console.log(err)
  }

  try {
    let res3 = await userDeployerWhitelistManager.setTierInfoAsync(tier)
    console.log('tier modified', res3)
  } catch (err) {
    console.log(err)
  }
  try {
    let res2 = await userDeployerWhitelistManager.getTierInfoAsync(0)
    console.log('Tier Info Fetched ', res2.fee.toString(10), res2.name)
  } catch (err) {
    console.log(err)
  }

}

test()




