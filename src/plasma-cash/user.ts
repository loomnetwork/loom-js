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
  DAppChainPlasmaClient,
  Client,
  createJSONRPCClient,
  PlasmaDB
} from '..'
// Helper function to create a user instance.

// User friendly wrapper for all Entity related functions, taking advantage of the database
export class User extends Entity {
  private _startBlock?: BN
  private static _contractName: string

  constructor(web3: Web3, params: IEntityParams, startBlock?: BN) {
    super(web3, params)
    this._startBlock = startBlock
  }

  static set contractName(contractName: string) {
    User._contractName = contractName
  }

  static createUser(
    web3Endpoint: string,
    plasmaAddress: string,
    dappchainEndpoint: string,
    ethPrivateKey: string,
    startBlock?: BN
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
    const dAppPlasmaClient = new DAppChainPlasmaClient({
      dAppClient,
      callerAddress,
      database,
      contractName: User._contractName
    })
    return new User(
      web3,
      {
        ethAccount,
        ethPlasmaClient,
        dAppPlasmaClient,
        childBlockInterval: 1000
      },
      startBlock
    )
  }

  // Transfer a coin by specifying slot & new owner
  async transferAsync(slot: BN, newOwner: string): Promise<any> {
    const { prevBlockNum, blockNum } = await this.findBlocks(slot)
    await this.transferTokenAsync({
      slot,
      prevBlockNum: blockNum,
      denomination: 1,
      newOwner: newOwner
    })
    return this.getCurrentBlockAsync()
  }

  async verifyInclusionAsync(slot: BN, block: BN): Promise<boolean> {
    // Get block root and the tx and verify
    const tx = await this.getPlasmaTxAsync(slot, block) // get the block number from the proof of inclusion and get the tx from that
    const root = await this.getBlockRootAsync(block)
    return this.checkInclusionAsync(tx, root, slot, tx.proof)
  }

  // Exiting a coin by specifying the slot. Finding the block numbers is done under the hood.
  async exitAsync(slot: BN): Promise<any> {
    const { prevBlockNum, blockNum } = await this.findBlocks(slot)
    return await this.startExitAsync({
      slot: slot,
      prevBlockNum: prevBlockNum,
      exitBlockNum: blockNum
    })
  }

  // Get all deposits, filtered by the user's address.
  async deposits(): Promise<any[]> {
    return await this.getDepositEvents(this._startBlock || new BN(0), false)
  }

  async allDeposits(): Promise<any[]> {
    return await this.getDepositEvents(this._startBlock || new BN(0), true)
  }

  disconnect() {
    // @ts-ignore
    this.web3.currentProvider.connection.close()
  }

  async debug(i: number) {
    const deps = await this.allDeposits()
    await this.submitPlasmaDepositAsync(deps[i])
  }

  private async findBlocks(slot: BN): Promise<any> {
    const coin = await this.getPlasmaCoinAsync(slot)
    // console.log('Expecting blocks', await this.getBlockNumbersAsync(coin.depositBlockNum))
    const coinData = await this.getCoinHistoryFromDBAsync(slot)
    let lastUserBlock = this.database.getBlock(slot)
    if (lastUserBlock === undefined) {
      lastUserBlock = await this.getCurrentBlockAsync()
    }
    // console.log('[DEBUG: CoinData]', coinData)
    // console.log('[DEBUG] Will check up to:', lastUserBlock)

    // Search for the latest transaction in the coin's history, O(N)
    let blockNum, prevBlockNum
    try {
      blockNum = coinData[0].blockNumber
      prevBlockNum = coinData[0].tx.prevBlockNum
      for (let i = 1 ; i < coinData.length; i++) {
        const coin = coinData[i]
        if (!coin.included) continue // skip exclusion proofs
        if (lastUserBlock.lt(coin.blockNumber)) {
          console.log(
            'MALICIOUS OPERATOR - SHOULD ONLY OCCUR FOR DOUBLE SPENDS/INVALID TRANSITIONS'
          )
          // in case the malicious operator includes invalid/double spends,
          // we want to get the last legitimate state, so we stop iterating
          break
        }
        if (coin.blockNumber.gt(blockNum)) {
          blockNum = coin.blockNumber
          prevBlockNum = coin.tx.prevBlockNum
        }
      }
    } catch (e) {
      prevBlockNum = new BN(0)
      blockNum = (await this.getPlasmaCoinAsync(slot)).depositBlockNum
    }
    // console.log('[DEBUG: Selected blocks]', prevBlockNum, blockNum)
    return { prevBlockNum, blockNum }
  }

  private async getCoinHistoryFromDBAsync(slot: BN): Promise<IDatabaseCoin[]> {
    const coin = await this.getPlasmaCoinAsync(slot)
    // Update the local database if needed.
    await this.checkHistoryAsync(coin)
    return this.database.getCoin(slot)
  }
}
