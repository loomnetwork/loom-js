import debug from 'debug'
import BN from 'bn.js'
import Web3 from 'web3'

import {
  EthereumPlasmaClient,
  IPlasmaCoin,
  IPlasmaDeposit,
  IPlasmaExitData,
  marshalDepositEvent
} from './ethereum-client'
import { Address, LocalAddress } from '../address'
import { DAppChainPlasmaClient } from './dappchain-client'
import { PlasmaCashTx } from './plasma-cash-tx'
import { EthersSigner } from '../solidity-helpers'
import { PlasmaDB } from './db'

const Plasma = require('./contracts/plasma-cash-abi.json')
const abiDecoder = require('abi-decoder') // NodeJS
abiDecoder.addABI(Plasma)

import { ethers } from 'ethers'
import { hexBN } from '../helpers'

const debugLog = debug('plasma-cash:entity')
const errorLog = debug('plasma-cash:entity:error')

export interface IProofs {
  inclusion: { [blockNumber: string]: string }
  exclusion: { [blockNumber: string]: string }
  transactions: { [blockNumber: string]: PlasmaCashTx }
}

export interface IEntityParams {
  /** Web3 account for use on Ethereum */
  ethPlasmaClient: EthereumPlasmaClient
  dAppPlasmaClient: DAppChainPlasmaClient
  /** Allows to override the amount of gas used when sending txs to Ethereum. */
  defaultGas?: number
  defaultAccount: string
  childBlockInterval: number
}

export interface IWeb3EventSub {
  unsubscribe(callback?: (error: Error, result: boolean) => void): void
}

// TODO: Maybe come up with a better name?
/**
 * Manages Plasma Cash related interactions between an Ethereum network (Ganache, Mainnet, etc.)
 * and a Loom DAppChain from the point of view of a single entity. An entity has two identities, one
 * on Ethereum, and one on the DAppChain, each identity has its own private/public key pair.
 */
export class Entity {
  private _ethers: ethers.Signer
  private _dAppPlasmaClient: DAppChainPlasmaClient
  private _ethPlasmaClient: EthereumPlasmaClient
  private _childBlockInterval: number
  private _ethAddress: string
  protected _defaultGas?: number
  protected _exitWatchers: { [slot: string]: IWeb3EventSub }
  protected _challengeWatchers: { [slot: string]: IWeb3EventSub }

  get ethers(): ethers.Signer {
    return this._ethers
  }

  get web3(): Web3 {
    return this._ethPlasmaClient.web3
  }

  get database(): PlasmaDB {
    return this._dAppPlasmaClient.database
  }

  get ethAddress(): string {
    return this._ethAddress
  }

  get plasmaEvents(): any {
    return this._ethPlasmaClient.plasmaEvents
  }

  get plasmaCashContract(): ethers.Contract {
    return this._ethPlasmaClient.plasmaCashContract
  }

  get contractName(): any {
    return this._dAppPlasmaClient.contractName
  }

  constructor(ethers: ethers.Signer, params: IEntityParams) {
    this._ethers = ethers
    this._ethPlasmaClient = params.ethPlasmaClient
    this._dAppPlasmaClient = params.dAppPlasmaClient
    this._defaultGas = params.defaultGas
    this._childBlockInterval = params.childBlockInterval
    this._exitWatchers = {}
    this._challengeWatchers = {}
    this._ethAddress = params.defaultAccount
  }

  // This should be called whenever a new block gets received
  async refreshAsync() {
    // Get all coins as the dappchain says
    const coins = Array.from(new Set(await this.getUserCoinsAsync()))

    // For each coin we got from the dappchain
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i]
      // Skip any coins that have been exited
      if (coin.contractAddress === '0x0000000000000000000000000000000000000000') continue
      await this.checkHistoryAsync(coin)
    }
  }

  async checkHistoryAsync(coin: IPlasmaCoin): Promise<boolean> {
    const blocks = await this.getBlockNumbersAsync(coin.depositBlockNum)
    const proofs = await this.getCoinHistoryAsync(coin.slot, blocks) // this will add the coin to state
    const valid = await this.verifyCoinHistoryAsync(coin.slot, proofs)
    return valid
  }

  async transferTokenAsync(params: {
    slot: BN
    prevBlockNum: BN
    denomination: BN | number
    newOwner: string
  }) {
    const { slot, prevBlockNum, denomination, newOwner } = params
    const tx = new PlasmaCashTx({
      slot,
      prevBlockNum,
      denomination,
      newOwner,
      prevOwner: this.ethAddress
    })
    await tx.signAsync(new EthersSigner(this._ethers))
    await this._dAppPlasmaClient.sendTxAsync(tx)
  }

  async getPlasmaTxAsync(slot: BN, blockNumber: BN): Promise<PlasmaCashTx> {
    const root = await this.getBlockRootAsync(blockNumber)
    let tx: PlasmaCashTx
    if (this.database.exists(slot, blockNumber)) {
      tx = this.database.getTx(slot, blockNumber)
    } else {
      tx = await this._dAppPlasmaClient.getPlasmaTxAsync(slot, blockNumber)
    }
    const included = await this.checkInclusionAsync(tx, root, slot, tx.proof)
    this._dAppPlasmaClient.database.receiveCoin(slot, blockNumber, included, tx)
    return tx
  }

  getExitAsync(slot: BN): Promise<IPlasmaExitData> {
    return this._ethPlasmaClient.getExitAsync({ slot, from: this.ethAddress })
  }

  getCurrentBlockAsync(): Promise<BN> {
    return this._dAppPlasmaClient.getCurrentPlasmaBlockNumAsync()
  }

  getPlasmaCoinAsync(slot: BN): Promise<IPlasmaCoin> {
    return this._ethPlasmaClient.getPlasmaCoinAsync({ slot, from: this.ethAddress })
  }

  getBlockRootAsync(blockNumber: BN): Promise<string> {
    return this._ethPlasmaClient.getBlockRootAsync({ blockNumber, from: this.ethAddress })
  }

  async getUserCoinsAsync(): Promise<IPlasmaCoin[]> {
    const addr = new Address('eth', LocalAddress.fromHexString(this.ethAddress))
    const slots = await this._dAppPlasmaClient.getUserSlotsAsync(addr)

    const coins = slots.map(s => this.getPlasmaCoinAsync(s))
    return await Promise.all(coins)
  }

  checkMembershipAsync(leaf: string, root: string, slot: BN, proof: string): Promise<boolean> {
    return this._ethPlasmaClient.checkMembershipAsync({
      leaf,
      root,
      slot,
      proof,
      from: this.ethAddress
    })
  }

  async startExitAsync(params: {
    slot: BN
    prevBlockNum: BN
    exitBlockNum: BN
  }): Promise<ethers.ContractTransaction> {
    const { slot, prevBlockNum, exitBlockNum } = params

    // In case the sender is exiting a Deposit transaction, they should just create a signed
    // transaction to themselves. There is no need for a merkle proof.
    if (exitBlockNum.modn(this._childBlockInterval) !== 0) {
      const exitTx = new PlasmaCashTx({
        slot,
        prevBlockNum: new BN(0),
        denomination: 1,
        newOwner: this.ethAddress
      })
      await exitTx.signAsync(new EthersSigner(this._ethers))
      return this._ethPlasmaClient.startExitAsync({
        slot,
        exitTx,
        exitBlockNum,
        from: this.ethAddress,
        gas: this._defaultGas
      })
    }

    const exitTx = await this.getPlasmaTxAsync(slot, exitBlockNum)
    if (!exitTx) {
      throw new Error(`${this.prefix(slot)} Invalid exit block: missing tx`)
    }
    const prevTx = await this.getPlasmaTxAsync(slot, prevBlockNum)
    if (!prevTx) {
      throw new Error(`${this.prefix(slot)} Invalid prev block: missing tx`)
    }
    return this._ethPlasmaClient.startExitAsync({
      slot,
      prevTx,
      exitTx,
      prevBlockNum,
      exitBlockNum,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  cancelExitsAsync(slots: BN[]): Promise<object> {
    return this._ethPlasmaClient.cancelExitsAsync({
      slots: slots,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async cancelExitAsync(slot: BN): Promise<any> {
    return this._ethPlasmaClient.cancelExitAsync({
      slot,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  finalizeExitsAsync(slots: BN[]): Promise<object> {
    return this._ethPlasmaClient.finalizeExitsAsync({
      slots: slots,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async finalizeExitAsync(slot: BN): Promise<any> {
    const tx = await this._ethPlasmaClient.finalizeExitAsync({
      slot,
      from: this.ethAddress,
      gas: this._defaultGas
    })
    await tx.wait()
    return tx
  }

  /**
   * @return Web3 subscription object that can be passed to stopWatching().
   */
  watchExit(slot: BN, fromBlock: BN): IWeb3EventSub {
    debugLog(`${this.prefix(slot)} Started watching exits`)
    if (this._exitWatchers[slot.toString()] !== undefined) {
      // replace old filter for that coin
      this._exitWatchers[slot.toString()].unsubscribe()
    }
    this._exitWatchers[slot.toString()] = this.plasmaEvents.events
      .StartedExit({
        filter: { slot: slot.toString() },
        fromBlock: fromBlock
      })
      .on('data', (event: any, err: any) => {
        this.challengeExitAsync(slot, event.returnValues.owner)
      })
      .on('error', (err: any) => errorLog(err))
    return this._exitWatchers[slot.toString()]
  }

  /**
   * @return Web3 subscription object that can be passed to stopWatching().
   */
  watchChallenge(slot: BN, fromBlock: BN): IWeb3EventSub {
    debugLog(`${this.prefix(slot)} Started watching challenges`)
    if (this._challengeWatchers[slot.toString()] !== undefined) {
      // replace old filter for that coin
      this._challengeWatchers[slot.toString()].unsubscribe()
    }
    this._challengeWatchers[slot.toString()] = this.plasmaEvents.events
      .ChallengedExit({
        filter: { slot: slot.toString() },
        fromBlock: fromBlock
      })
      .on('data', (event: any, err: any) => {
        this.respondChallengeAsync(
          slot,
          event.returnValues.txHash,
          event.returnValues.challengingBlockNumber
        )
      })
      .on('error', (err: any) => errorLog(err))
    return this._challengeWatchers[slot.toString()]
  }

  async challengeExitAsync(slot: BN, owner: String) {
    const exit = await this.getExitAsync(slot)
    if (exit.exitBlock.eq(new BN(0))) return
    if (owner === this.ethAddress) {
      debugLog(`${this.prefix(slot)} Valid exit!`)
      return
    } else {
      debugLog(`${this.prefix(slot)} Challenging exit!`)
    }

    const coin = await this.getPlasmaCoinAsync(slot)
    const blocks = await this.getBlockNumbersAsync(coin.depositBlockNum)
    const proofs = await this.getCoinHistoryAsync(slot, blocks)
    for (let i in blocks) {
      const blk = blocks[i]
      if (!(blk.toString() in proofs.inclusion)) {
        continue
      }
      if (blk.gt(exit.exitBlock)) {
        debugLog(`${this.prefix(slot)} Challenge Spent Coin with ${blk}!`)
        const tx = await this.challengeAfterAsync({ slot: slot, challengingBlockNum: blk })
        await tx.wait()
        break
      } else if (exit.prevBlock.lt(blk) && blk.lt(exit.exitBlock)) {
        debugLog(`${this.prefix(slot)} Challenge Double Spend with ${blk}!`)
        const tx = await this.challengeBetweenAsync({ slot: slot, challengingBlockNum: blk })
        await tx.wait()
        break
      } else if (blk.lt(exit.prevBlock)) {
        debugLog(`${this.prefix(slot)} Challenge Invalid History! with ${blk}`)
        const tx = await this.challengeBeforeAsync({
          slot: slot,
          challengingBlockNum: blk
        })
        await tx.wait()
        break
      }
    }
  }

  async respondChallengeAsync(slot: BN, txHash: string, challengingBlockNum: BN) {
    const coin = await this.getPlasmaCoinAsync(slot)
    const blocks = await this.getBlockNumbersAsync(coin.depositBlockNum)
    // We challenge with the block that includes a transaction right after the challenging block
    const proofs = await this.getCoinHistoryAsync(slot, blocks)
    for (let i in blocks) {
      const blk = blocks[i]
      // check only inclusion blocks
      if (!(blk.toString() in proofs.inclusion)) {
        continue
      }
      // challenge with the first block after the challengingBlock
      if (blk.gt(new BN(challengingBlockNum))) {
        debugLog(`${this.prefix(slot)} Responding with ${blk}!`)
        const tx = await this.respondChallengeBeforeAsync({
          slot,
          challengingTxHash: txHash,
          respondingBlockNum: blk
        })
        await tx.wait()
        break
      }
    }
  }

  async getCoinHistoryAsync(slot: BN, blockNumbers: BN[]): Promise<IProofs> {
    const inclProofs: { [blockNumber: string]: string } = {}
    const exclProofs: { [blockNumber: string]: string } = {}
    const txs: { [blockNumber: string]: PlasmaCashTx } = {}

    for (let i in blockNumbers) {
      const blockNumber = blockNumbers[i]
      const root = await this.getBlockRootAsync(blockNumber)

      const tx = await this.getPlasmaTxAsync(slot, blockNumber)

      txs[blockNumber.toString()] = tx
      const included = await this.checkInclusionAsync(tx, root, slot, tx.proof)
      if (included) {
        inclProofs[blockNumber.toString()] = tx.proof
      } else {
        exclProofs[blockNumber.toString()] = tx.proof
      }
      this._dAppPlasmaClient.database.receiveCoin(slot, blockNumber, included, tx)
    }
    return {
      exclusion: exclProofs,
      inclusion: inclProofs,
      transactions: txs
    }
  }

  async verifyCoinHistoryAsync(slot: BN, proofs: IProofs): Promise<boolean> {
    // Check inclusion proofs
    const coin = await this.getPlasmaCoinAsync(slot)
    let earliestValidBlock = coin.depositBlockNum
    for (let p in proofs.inclusion) {
      const blockNumber = new BN(p)
      const tx = proofs.transactions[p] // get the block number from the proof of inclusion and get the tx from that
      const root = await this.getBlockRootAsync(blockNumber)
      const included = await this.checkInclusionAsync(tx, root, slot, proofs.inclusion[p])
      if (included) {
        // Skip deposit blocks
        if (tx.prevBlockNum.eq(new BN(0))) {
          continue
        }
        if (tx.prevBlockNum.eq(earliestValidBlock)) {
          earliestValidBlock = blockNumber
        } else {
          return false
        }
      }
    }

    // Check exclusion proofs
    for (let p in proofs.exclusion) {
      const blockNumber = new BN(p)
      const root = await this.getBlockRootAsync(blockNumber)
      const excluded = await this.checkExclusionAsync(root, slot, proofs.exclusion[p])
      if (!excluded) {
        return false
      }
    }
    return true
  }

  async checkExclusionAsync(root: string, slot: BN, proof: string): Promise<boolean> {
    // keccak(uint256(0))
    const emptyHash = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563'
    const ret = await this.checkMembershipAsync(emptyHash, root, slot, proof)
    return ret
  }

  async checkInclusionAsync(
    tx: PlasmaCashTx,
    root: string,
    slot: BN,
    proof: string
  ): Promise<boolean> {
    let ret
    if (tx.prevBlockNum.eq(new BN(0))) {
      ret = tx.hash === root
    } else {
      ret = await this.checkMembershipAsync(tx.hash, root, slot, proof)
    }
    return ret
  }

  async getDepositEvents(fromBlock?: BN, all?: boolean): Promise<IPlasmaDeposit[]> {
    const filter = !all ? { from: this.ethAddress } : {}
    const events: any[] = await this.plasmaEvents.getPastEvents('Deposit', {
      filter: filter,
      fromBlock: fromBlock ? fromBlock : 0
    })
    const deposits = events.map<IPlasmaDeposit>(e => marshalDepositEvent(e.returnValues))
    return deposits
  }

  async getBlockNumbersAsync(startBlock: any): Promise<BN[]> {
    const endBlock: BN = await this.getCurrentBlockAsync()
    const blockNumbers: BN[] = []
    if (startBlock.eq(endBlock)) {
      return [startBlock]
    }
    const nextBlk = this.nextNonDepositBlock(startBlock)
    if (nextBlk.lte(endBlock)) {
      const interval = new BN(this._childBlockInterval)
      for (let i: BN = nextBlk; i.lte(endBlock); i = i.add(interval)) {
        blockNumbers.push(i)
      }
    }
    let ret: BN[]
    if (startBlock.eq(nextBlk)) {
      ret = blockNumbers
    } else {
      ret = [startBlock, ...blockNumbers]
    }
    return ret
  }

  protected nextNonDepositBlock(startBlock: any): BN {
    return new BN(Math.ceil(startBlock / this._childBlockInterval) * this._childBlockInterval)
  }

  stopWatching(slot: BN) {
    if (this._exitWatchers[slot.toString()]) {
      debugLog(`${this.prefix(slot)} Stopped watching exits`)
      this._exitWatchers[slot.toString()].unsubscribe()
      delete this._exitWatchers[slot.toString()]
    }
    if (this._challengeWatchers[slot.toString()]) {
      debugLog(`${this.prefix(slot)} Stopped watching challenges`)
      this._challengeWatchers[slot.toString()].unsubscribe()
      delete this._challengeWatchers[slot.toString()]
    }
  }

  async withdrawAsync(slot: BN) {
    const tx = await this._ethPlasmaClient.withdrawAsync({
      slot,
      from: this.ethAddress,
      gas: this._defaultGas
    })
    await tx.wait()
    this.database.removeCoin(slot) // remove the coin from the state
  }

  withdrawBondsAsync(): Promise<object> {
    return this._ethPlasmaClient.withdrawBondsAsync({
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async challengeAfterAsync(params: {
    slot: BN
    challengingBlockNum: BN
  }): Promise<ethers.ContractTransaction> {
    const { slot, challengingBlockNum } = params
    const challengingTx = await this.getPlasmaTxAsync(slot, challengingBlockNum)
    if (!challengingTx) {
      throw new Error(`${this.prefix(slot)} Invalid challenging block: missing tx`)
    }
    return this._ethPlasmaClient.challengeAfterAsync({
      slot,
      challengingBlockNum,
      challengingTx,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async challengeBetweenAsync(params: {
    slot: BN
    challengingBlockNum: BN
  }): Promise<ethers.ContractTransaction> {
    const { slot, challengingBlockNum } = params
    const challengingTx = await this.getPlasmaTxAsync(slot, challengingBlockNum)
    if (!challengingTx) {
      throw new Error(`${this.prefix(slot)} Invalid challenging block: missing tx`)
    }
    return this._ethPlasmaClient.challengeBetweenAsync({
      slot,
      challengingBlockNum,
      challengingTx,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async challengeBeforeAsync(params: {
    slot: BN
    challengingBlockNum: BN
  }): Promise<ethers.ContractTransaction> {
    const { slot, challengingBlockNum } = params

    // In case the sender is exiting a Deposit transaction, they should just create a signed
    // transaction to themselves. There is no need for a merkle proof.
    if (challengingBlockNum.modn(this._childBlockInterval) !== 0) {
      const challengingTx = new PlasmaCashTx({
        slot,
        prevBlockNum: new BN(0),
        denomination: 1,
        newOwner: this.ethAddress
      })
      await challengingTx.signAsync(new EthersSigner(this._ethers))
      return this._ethPlasmaClient.challengeBeforeAsync({
        slot,
        challengingTx,
        challengingBlockNum,
        from: this.ethAddress,
        gas: this._defaultGas
      })
    }

    // Otherwise, they should get the raw tx info from the blocks, and the merkle proofs.
    const challengingTx = await this.getPlasmaTxAsync(slot, challengingBlockNum)
    if (!challengingTx) {
      throw new Error(`${this.prefix(slot)} Invalid exit block: missing tx`)
    }

    return this._ethPlasmaClient.challengeBeforeAsync({
      slot,
      challengingTx,
      challengingBlockNum,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  async respondChallengeBeforeAsync(params: {
    slot: BN
    challengingTxHash: string
    respondingBlockNum: BN
  }): Promise<ethers.ContractTransaction> {
    const { slot, challengingTxHash, respondingBlockNum } = params
    const respondingTx = await this.getPlasmaTxAsync(slot, respondingBlockNum)
    if (!respondingTx) {
      throw new Error(`${this.prefix(slot)} Invalid responding block: missing tx`)
    }
    return this._ethPlasmaClient.respondChallengeBeforeAsync({
      slot,
      challengingTxHash,
      respondingBlockNum,
      respondingTx,
      from: this.ethAddress,
      gas: this._defaultGas
    })
  }

  /**
   * Retrieves the Plasma coin created by a deposit tx.
   * Throws an error if the given tx receipt doesn't contain a Plasma deposit event.
   *
   * @param tx The transaction that we want to decode.
   */
  async getCoinFromTxAsync(tx: ethers.providers.TransactionResponse): Promise<IPlasmaCoin> {
    const _tx = await tx.wait()
    if (_tx.logs === undefined) {
      throw Error('No logs were found')
    }

    const logs = _tx.logs.map(l => this.plasmaCashContract.interface.parseLog(l))
    const depositLog = logs.find(l => l !== null && l.name === 'Deposit')
    if (depositLog === undefined) {
      throw Error('No deposit event found')
    }
    const coinId = hexBN(depositLog.values.slot)
    return this.getPlasmaCoinAsync(coinId)
  }

  prefix(slot: BN) {
    return `[${this.ethAddress}, ${slot.toString(16)}]`
  }
}
