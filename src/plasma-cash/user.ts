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
  SignedContract,
  PlasmaDB
} from '..'
import { IPlasmaCoin } from './ethereum-client'
import { sleep } from '../helpers'
import { IWeb3EventSub } from './entity'

const ERC721 = require('./contracts/ERC721.json')
const ERC20 = require('./contracts/ERC20.json')
// Helper function to create a user instance.

// User friendly wrapper for all Entity related functions, taking advantage of the database
export class User extends Entity {
  private _startBlock?: BN
  private static _contractName: string
  private buffers: any = {}
  private newBlocks: any

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

  async depositETHAsync(amount: BN): Promise<IPlasmaCoin> {
    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await this.sendETH(this.plasmaCashContract._address, amount, 220000)
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }

  async depositERC721Async(uid: BN, address: string): Promise<IPlasmaCoin> {
    // @ts-ignore
    const token = new SignedContract(this._web3, ERC721, address, this.ethAccount).instance
    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await token.safeTransferFrom([
      this.ethAccount.address,
      this.plasmaCashContract._address,
      uid.toString()
    ])
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }

  async depositERC20Async(amount: BN, address: string): Promise<IPlasmaCoin> {
    // @ts-ignore
    const token = new SignedContract(this._web3, ERC20, address, this.ethAccount).instance
    // Get how much the user has approved
    const currentApproval = new BN(
      await token.allowance(this.ethAccount.address, this.plasmaCashContract._address)
    )

    // amount - approved
    if (amount.gt(currentApproval)) {
      await token.approve([
        this.plasmaCashContract._address,
        amount.sub(currentApproval).toString()
      ])
      console.log('Approved an extra', amount.sub(currentApproval))
    }
    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await this.plasmaCashContract.depositERC20([amount.toString(), address])
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }
  // Buffer is how many blocks the client will wait for the tx to get confirmed
  async transferAndVerifyAsync(slot: BN, newOwner: string, buffer: number = 6): Promise<any> {
    await this.transferAsync(slot, newOwner)
    let watcher = this.plasmaCashContract.events
      .SubmittedBlock({
        filter: {},
        fromBlock: await this.web3.eth.getBlockNumber()
      })
      .on('data', (event: any, err: any) => {
        if (this.verifyInclusionAsync(slot, new BN(event.returnValues.blockNumber))) {
          console.log(
            `${this.prefix(slot)} Tx included & verified in block ${
              event.returnValues.blockNumber
            }`
          )
          this.stopWatching(slot)
          watcher.unsubscribe()
          this.buffers[slot.toString()] = 0
        }
        if (this.buffers[slot.toString()]++ == buffer) {
          watcher.unsubscribe()
          this.buffers[slot.toString()] = 0
          throw new Error(`${this.prefix(slot)} Tx was censored for ${buffer} blocks.`)
        }
      })
      .on('error', (err: any) => console.log(err))
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

  // Whenever a new block gets submitted refresh the user's state for their coins
  async watchBlocks() {
    this.newBlocks = this.plasmaCashContract.events
      .SubmittedBlock({
        filter: {},
        fromBlock: await this.web3.eth.getBlockNumber()
      })
      .on('data', async (event: any, err: any) => {
        const blk = new BN(event.returnValues.blockNumber)
        console.log(`Got new block: ${blk}`)

        // Get user coins from the dappchain
        const coins = await this.getUserCoinsAsync()

        // For each coin he already had, just get the history
        const localCoins = await this.database.getAllCoinSlots()

        for (let i in coins) {
          const coin = coins[i]
          let exists = false
          for (let j in localCoins) {
            if (coin.slot.eq(localCoins[j])) exists = true
          }
          if (exists) {
            await this.getPlasmaTxAsync(coin.slot, blk) // this will add the coin to state
          } else {
            this.receiveAndWatchCoinAsync(coin.slot)
          }
        }
      })
      .on('error', (err: any) => console.log(err))
  }

  stopWatchingBlocks() {
    this.newBlocks.unsubscribe()
    delete this.newBlocks
  }

  // Receives a coin, checks if it's valid, and if it is checks if there's an exit pending for it e
  async receiveAndWatchCoinAsync(slot: BN): Promise<boolean> {
    const valid = await this.receiveCoinAsync(slot)
    if (valid) {
      const events: any[] = await this.plasmaCashContract.getPastEvents('StartedExit', {
        filter: { slot: slot.toString() },
        fromBlock: this._startBlock
      })
      if (events.length > 0) {
        // Challenge the last exit of this coin if there were any exits at the time
        const exit = events[events.length - 1]
        await this.challengeExitAsync(slot, exit.owner)
      }
      this.watchExit(slot, new BN(await this.web3.eth.getBlockNumber()))
      console.log(`${this.prefix(slot)} Verified history, started watching.`)
    } else {
      this.database.removeCoin(slot)
      console.log(`${this.prefix(slot)} Invalid history, rejecting...`)
    }
    return valid
  }

  // Called whenever the user receives a coin.
  async receiveCoinAsync(slot: BN): Promise<boolean> {
    const coin = await this.getPlasmaCoinAsync(slot)
    const valid = await this.checkHistoryAsync(coin)
    const blocks = await this.getBlockNumbersAsync(coin.depositBlockNum)
    this.database.saveBlock(coin.slot, blocks[blocks.length - 1])
    return valid
  }

  async verifyInclusionAsync(slot: BN, block: BN): Promise<boolean> {
    // Get block root and the tx and verify
    const tx = await this.getPlasmaTxAsync(slot, block) // get the block number from the proof of inclusion and get the tx from that
    const root = await this.getBlockRootAsync(block)
    return this.checkInclusionAsync(tx, root, slot, tx.proof)
  }

  // Exiting a coin by specifying the slot. Finding the block numbers is done under the hood.
  // Stop watching for exits once the event is mined
  async exitAsync(slot: BN): Promise<any> {
    // Once the exit is started, stop watching for exit events
    this.plasmaCashContract.once(
      'StartedExit',
      {
        filter: { slot: slot.toString() },
        fromBlock: await this.web3.eth.getBlockNumber()
      },
      async () => {
        // Stop watching for exit events
        this.stopWatching(slot)
        // Start watching challenge events
        this.watchChallenge(slot, new BN(await this.web3.eth.getBlockNumber()))
      }
    )

    // Once the exit has been finalized, stop watching for challenge events
    this.plasmaCashContract.once(
      'FinalizedExit',
      {
        filter: { slot: slot.toString() },
        fromBlock: await this.web3.eth.getBlockNumber()
      },
      () => this.stopWatching(slot)
    )

    const { prevBlockNum, blockNum } = await this.findBlocks(slot)
    await this.startExitAsync({
      slot: slot,
      prevBlockNum: prevBlockNum,
      exitBlockNum: blockNum
    })
  }

  // Get all deposits, filtered by the user's address.
  async deposits(): Promise<any[]> {
    const _deposits = await this.getDepositEvents(this._startBlock || new BN(0), false)
    const coins = _deposits.map(d => this.getPlasmaCoinAsync(d.slot))
    return await Promise.all(coins)
  }

  async allDeposits(): Promise<any[]> {
    const _deposits = await this.getDepositEvents(this._startBlock || new BN(0), true)
    const coins = _deposits.map(d => this.getPlasmaCoinAsync(d.slot))
    return await Promise.all(coins)
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
    const coinData = await this.getCoinHistoryFromDBAsync(slot)
    let lastUserBlock = this.database.getBlock(slot)
    if (lastUserBlock === undefined) {
      lastUserBlock = await this.getCurrentBlockAsync()
    }

    // Search for the latest transaction in the coin's history, O(N)
    let blockNum, prevBlockNum
    try {
      blockNum = coinData[0].blockNumber
      prevBlockNum = coinData[0].tx.prevBlockNum
      for (let i = 1; i < coinData.length; i++) {
        const coin = coinData[i]
        if (!coin.included) continue // skip exclusion proofs
        if (lastUserBlock.lt(coin.blockNumber)) {
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
      // If no coindata is available in the database, then that's a new coin
      prevBlockNum = new BN(0)
      blockNum = (await this.getPlasmaCoinAsync(slot)).depositBlockNum
    }
    return { prevBlockNum, blockNum }
  }
  private async getCoinHistoryFromDBAsync(slot: BN): Promise<IDatabaseCoin[]> {
    const coin = await this.getPlasmaCoinAsync(slot)
    // Update the local database
    await this.checkHistoryAsync(coin)
    return this.database.getCoin(slot)
  }

  private async pollForBlockChange(
    currentBlock: BN,
    maxIters: number,
    sleepTime: number
  ): Promise<BN> {
    let blk = await this.getCurrentBlockAsync()
    for (let i = 0; i < maxIters; i++) {
      await sleep(sleepTime)
      blk = await this.getCurrentBlockAsync()
      if (blk.gt(currentBlock)) {
        return blk
      }
    }
    throw new Error(
      `Exceeded max iterations while waiting for the next block after ${currentBlock}`
    )
  }
}
