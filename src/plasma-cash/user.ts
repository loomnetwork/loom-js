import BN from 'bn.js'
import Web3 from 'web3'
import {
  Entity,
  IEntityParams,
  EthereumPlasmaClient,
  CryptoUtils,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Address,
  LocalAddress,
  IDatabaseCoin,
  CachedDAppChainPlasmaClient,
  Client,
  createJSONRPCClient,
  PlasmaDB
} from '..'

// Helper function to create a user instance.
export function createUser(
  web3Endpoint: string,
  plasmaAddress: string,
  dappchainEndpoint: string,
  ethPrivateKey: string,
  addressbook?: object,
  token?: any, // TODO Type
  startBlock?: BN,
  contractName?: string
): User {
  const provider = new Web3.providers.WebsocketProvider(web3Endpoint)
  const web3 = new Web3(provider)
  const database = new PlasmaDB(web3Endpoint, dappchainEndpoint, plasmaAddress, ethPrivateKey)
  const ethAccount = web3.eth.accounts.privateKeyToAccount(ethPrivateKey)
  const ethPlasmaClient = new EthereumPlasmaClient(web3, ethAccount, plasmaAddress)
  const writer = createJSONRPCClient({ protocols: [{ url: dappchainEndpoint + '/rpc' }] })
  const reader = createJSONRPCClient({ protocols: [{ url: dappchainEndpoint + '/query' }] })
  const dAppClient = new Client('default', writer, reader)
  // TODO: Key should not be generated each time, user should provide their key, or it should be retrieved through some one way mapping
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  dAppClient.txMiddleware = [
    new NonceTxMiddleware(pubKey, dAppClient),
    new SignedTxMiddleware(privKey)
  ]
  const callerAddress = new Address('default', LocalAddress.fromPublicKey(pubKey))
  const dAppPlasmaClient = new CachedDAppChainPlasmaClient({
    dAppClient,
    callerAddress,
    database,
    contractName
  })
  return new User(
    web3,
    {
      ethAccount,
      ethPlasmaClient,
      dAppPlasmaClient,
      childBlockInterval: 1000
    },
    addressbook,
    token,
    startBlock
  )
}

// User friendly wrapper for all Entity related functions, taking advantage of the database
export class User extends Entity {
  private _startBlock: BN | undefined
  private _addressbook: any | undefined
  private _token: any | undefined

  constructor(web3: Web3, params: IEntityParams, addressbook?: any, token?: any, startBlock?: BN) {
    super(web3, params)
    this._token = token
    this._addressbook = addressbook
    this._startBlock = startBlock
  }

  // Initialize a demo erc721 token
  async deposit(uid: BN) {
    return await this._token.safeTransferFrom([
      this._addressbook.self,
      this._addressbook.plasmaAddress,
      uid
    ])
  }

  // Transfer a coin by specifying slot & new owner
  async transfer(slot: BN, newOwner: string) {
    const { prevBlockNum } = await this.findBlocks(slot)
    await this.transferTokenAsync({
      slot,
      prevBlockNum,
      denomination: 1,
      newOwner: newOwner
    })
    this.database.removeCoin(slot)
  }

  // Exiting a coin by specifying the slot. Finding the block numbers is done under the hood.
  async exit(slot: BN) {
    const { prevBlockNum, blockNum } = await this.findBlocks(slot)
    return await this.startExitAsync({
      slot: slot,
      prevBlockNum: prevBlockNum,
      exitBlockNum: blockNum
    })
  }

  async finalizeExit(slot: BN) {
    return await this.plasmaCashContract.finalizeExit([slot])
  }

  async withdraw(slot: BN) {
    this.database.removeCoin(slot) // remove the coin from the state
    return await this.withdrawAsync(slot)
  }

  // Get all deposits, filtered by the user's address.
  async deposits(): Promise<any[]> {
    return await this.getDepositEvents(this._startBlock || new BN(0), false)
  }

  async allDeposits(): Promise<any[]> {
    return await this.getDepositEvents(this._startBlock || new BN(0), true)
  }

  async debug(i: number) {
    const deps = await this.allDeposits()
    await this.submitPlasmaDepositAsync(deps[i])
  }

  private async findBlocks(slot: BN): Promise<any> {
    const coinData: IDatabaseCoin[] = this.database.getCoin(slot)
    if (coinData.length == 0) await this.refreshAsync()
    // Search for the latest transaction in the coin's history, O(N)
    let blockNum = coinData[0].blockNumber
    let prevBlockNum = coinData[0].tx.prevBlockNum
    for (let i in coinData) {
      const coin = coinData[i]
      if (coin.blockNumber > blockNum) {
        blockNum = coin.blockNumber
        prevBlockNum = coin.tx.prevBlockNum
      }
    }
    return { prevBlockNum, blockNum }
  }
}
