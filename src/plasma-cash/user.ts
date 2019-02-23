import debug from 'debug'
import BN from 'bn.js'
import Web3 from 'web3'
import { ethers, utils } from 'ethers'

import {
  Entity,
  IEntityParams,
  EthereumPlasmaClient,
  CryptoUtils,
  Address,
  LocalAddress,
  IDatabaseCoin,
  DAppChainPlasmaClient,
  Client,
  PlasmaDB
} from '..'
import { IPlasmaCoin } from './ethereum-client'
import { sleep } from '../helpers'
import { AddressMapper } from '../contracts/address-mapper'
import { EthersSigner } from '../solidity-helpers'

const debugLog = debug('plasma-cash:user')
const errorLog = debug('plasma-cash:user:error')

const ERC721_ABI = ['function safeTransferFrom(address from, address to, uint256 tokenId) public']
const ERC20_ABI = [
  'function approve(address spender, uint256 value) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)'
]

// User friendly wrapper for all Entity related functions, taking advantage of the database
export class User extends Entity {
  private _startBlock?: BN
  private static _contractName: string
  private buffers: any = {}
  private newBlocks: any

  constructor(web3: ethers.Signer, params: IEntityParams, startBlock?: BN) {
    super(web3, params)
    this._startBlock = startBlock
  }

  static set contractName(contractName: string) {
    User._contractName = contractName
  }

  static async createMetamaskUser(
    web3: Web3,
    dappchainPrivateKey: string | null,
    plasmaAddress: string,
    dappchainEndpoint: string,
    eventsEndpoint: string,
    startBlock?: BN,
    chainId?: string
  ): Promise<User> {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const signer = provider.getSigner()
    return this.createUser(
      signer,
      dappchainPrivateKey,
      plasmaAddress,
      dappchainEndpoint,
      eventsEndpoint,
      undefined,
      startBlock,
      chainId
    )
  }

  static async createOfflineUser(
    privateKey: string,
    dappchainPrivateKey: string | null,
    endpoint: string,
    plasmaAddress: string,
    dappchainEndpoint: string,
    eventsEndpoint: string,
    dbPath?: string,
    startBlock?: BN,
    chainId?: string
  ): Promise<User> {
    const provider = new ethers.providers.JsonRpcProvider(endpoint)
    const wallet = new ethers.Wallet(privateKey, provider)
    return this.createUser(
      wallet,
      dappchainPrivateKey,
      plasmaAddress,
      dappchainEndpoint,
      eventsEndpoint,
      dbPath,
      startBlock,
      chainId
    )
  }

  static async createUser(
    wallet: ethers.Signer,
    dappchainPrivateKey: string | null,
    plasmaAddress: string,
    dappchainEndpoint: string,
    eventsEndpoint: string,
    dbPath?: string,
    startBlock?: BN,
    chainId?: string
  ): Promise<User> {
    const { client: dAppClient, publicKey: pubKey, address: callerAddress } = Client.new(
      dappchainPrivateKey || CryptoUtils.Uint8ArrayToB64(CryptoUtils.generatePrivateKey()),
      dappchainEndpoint,
      chainId || 'default'
    )

    const database = new PlasmaDB(dbPath)
    const ethPlasmaClient = new EthereumPlasmaClient(wallet, plasmaAddress, eventsEndpoint)

    const addressMapper = await AddressMapper.createAsync(
      dAppClient,
      new Address(dAppClient.chainId, LocalAddress.fromPublicKey(pubKey))
    )
    const ethAddress = new Address('eth', LocalAddress.fromHexString(await wallet.getAddress()))
    if (!(await addressMapper.hasMappingAsync(ethAddress))) {
      // Register our address if it's not found
      await addressMapper.addIdentityMappingAsync(
        ethAddress,
        callerAddress,
        new EthersSigner(wallet)
      )
    }

    const dAppPlasmaClient = new DAppChainPlasmaClient({
      dAppClient,
      callerAddress,
      database,
      contractName: User._contractName
    })

    const defaultAccount = await wallet.getAddress()

    return new User(
      wallet,
      {
        ethPlasmaClient,
        dAppPlasmaClient,
        defaultAccount,
        defaultGas: 3141592,
        childBlockInterval: 1000
      },
      startBlock
    )
  }

  async depositETHAsync(amount: BN): Promise<IPlasmaCoin> {
    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await this.ethers.sendTransaction({
      to: this.plasmaCashContract.address,
      value: '0x' + amount.toString(16)
    })
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    await this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }

  async depositERC721Async(uid: BN, address: string): Promise<IPlasmaCoin> {
    const token = new ethers.Contract(address, ERC721_ABI, this.ethers)
    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await token.safeTransferFrom(
      this.ethAddress,
      this.plasmaCashContract.address,
      '0x' + uid.toString(16),
      { gasLimit: ethers.utils.hexlify(this._defaultGas!) }
    )
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    await this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }

  async depositERC20Async(amount: BN, address: string): Promise<IPlasmaCoin> {
    const token = new ethers.Contract(address, ERC20_ABI, this.ethers)
    // Get how much the user has approved
    const valueApproved = await token.allowance(this.ethAddress, this.plasmaCashContract.address)
    const currentApproval = new BN(utils.bigNumberify(valueApproved).toString())

    // amount - approved
    if (amount.gt(currentApproval)) {
      await token.approve(this.plasmaCashContract.address, amount.sub(currentApproval).toString())
      debugLog('Approved an extra', amount.sub(currentApproval))
    }

    let currentBlock = await this.getCurrentBlockAsync()
    const tx = await this.plasmaCashContract.depositERC20(amount.toString(), address)
    const coin = await this.getCoinFromTxAsync(tx)
    currentBlock = await this.pollForBlockChange(currentBlock, 20, 2000)
    await this.receiveAndWatchCoinAsync(coin.slot)
    return coin
  }

  // Buffer is how many blocks the client will wait for the tx to get confirmed
  async transferAndVerifyAsync(slot: BN, newOwner: string, buffer: number = 6): Promise<any> {
    await this.transferAsync(slot, newOwner)
    let watcher = this.plasmaEvents.events
      .SubmittedBlock({
        filter: {},
        fromBlock: await this.web3.eth.getBlockNumber()
      })
      .on('data', (event: any, err: any) => {
        if (this.verifyInclusionAsync(slot, new BN(event.returnValues.blockNumber))) {
          debugLog(
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
      .on('error', (err: any) => errorLog(err))
  }

  // Transfer a coin by specifying slot & new owner
  async transferAsync(slot: BN, newOwner: string): Promise<any> {
    const { blockNum } = await this.findBlocks(slot)
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
    debugLog(`[${this.ethAddress}] Watching for blocks...`)
    this.newBlocks = this.plasmaEvents.events
      .SubmittedBlock({
        filter: {},
        fromBlock: await this.web3.eth.getBlockNumber()
      })
      .on('data', async (event: any, err: any) => {
        const blk = new BN(event.returnValues.blockNumber)
        debugLog(`[${this.ethAddress}] Got new block: ${blk}`)

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
            // TODO: If a new block arrives and we have the coin already in state but are not watching for its exits, e.g. after restarting the client, we need to start watching again.
          } else {
            await this.receiveAndWatchCoinAsync(coin.slot)
          }
        }
      })
      .on('error', (err: any) => errorLog(err))
  }

  stopWatchingBlocks() {
    this.newBlocks.unsubscribe()
    delete this.newBlocks
  }

  // Receives a coin, checks if it's valid, and if it is checks if there's an exit pending for it e
  async receiveAndWatchCoinAsync(slot: BN): Promise<boolean> {
    const valid = await this.receiveCoinAsync(slot)
    if (valid) {
      const events: any[] = await this.plasmaEvents.getPastEvents('StartedExit', {
        filter: { slot: slot.toString() },
        fromBlock: this._startBlock
      })
      if (events.length > 0) {
        // Challenge the last exit of this coin if there were any exits at the time
        const exit = events[events.length - 1]
        await this.challengeExitAsync(slot, exit.owner)
      }
      this.watchExit(slot, new BN(await this.web3.eth.getBlockNumber()))
      debugLog(`${this.prefix(slot)} Verified history, started watching.`)
    } else {
      this.database.removeCoin(slot)
      debugLog(`${this.prefix(slot)} Invalid history, rejecting...`)
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
    this.plasmaEvents.once(
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
    this.plasmaEvents.once(
      'FinalizedExit',
      {
        filter: { slot: slot.toString() },
        fromBlock: await this.web3.eth.getBlockNumber()
      },
      () => {
        this.stopWatching(slot)
      }
    )

    const { prevBlockNum, blockNum } = await this.findBlocks(slot)
    const tx = await this.startExitAsync({
      slot: slot,
      prevBlockNum: prevBlockNum,
      exitBlockNum: blockNum
    })
    await tx.wait()
  }

  // Get all deposits, filtered by the user's address.
  async deposits(): Promise<IPlasmaCoin[]> {
    const _deposits = await this.getDepositEvents(this._startBlock || new BN(0), false)
    const coins = _deposits.map(d => this.getPlasmaCoinAsync(d.slot))
    return Promise.all(coins)
  }

  async allDeposits(): Promise<any[]> {
    const _deposits = await this.getDepositEvents(this._startBlock || new BN(0), true)
    const coins = _deposits.map(d => this.getPlasmaCoinAsync(d.slot))
    return Promise.all(coins)
  }

  disconnect() {
    // @ts-ignore
    this.web3.currentProvider.connection.close()
    this.plasmaEvents.currentProvider.connection.close()
  }

  private async findBlocks(slot: BN): Promise<any> {
    const coinData = await this.getCoinHistoryFromDBAsync(slot)
    let lastUserBlock = this.database.getBlock(slot)
    if (lastUserBlock === undefined) {
      lastUserBlock = await this.getCurrentBlockAsync()
    }

    // Search for the latest transaction in the coin's history, O(N)
    let blockNum
    let prevBlockNum
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

  async pollForBlockChange(currentBlock: BN, maxIters: number, sleepTime: number): Promise<BN> {
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
