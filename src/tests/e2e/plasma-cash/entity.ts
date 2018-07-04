import BN from 'bn.js'
import Web3 from 'web3'

import {
  LocalAddress,
  Address,
  EthereumPlasmaClient,
  DAppChainPlasmaClient,
  PlasmaCashTx,
  CryptoUtils,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Web3Signer,
  IPlasmaCoin
} from '../../../index'
import { ADDRESSES, DEFAULT_GAS, CHILD_BLOCK_INTERVAL } from './config'
import { createTestHttpClient } from '../../helpers'
import { IPlasmaDeposit } from '../../../plasma-cash/ethereum-client'

// TODO: Rename & move out of test directory, should be part of the public API
export class Entity {
  private _web3: Web3
  // web3 account
  private _ethAccount: any // TODO: type this properly
  private _dAppPlasmaClient: DAppChainPlasmaClient
  private _ethPlasmaClient: EthereumPlasmaClient

  get ethAddress(): string {
    return this._ethAccount.address
  }

  get plasmaCashContract(): any {
    return this._ethPlasmaClient.plasmaCashContract
  }

  constructor(web3: Web3, ethPrivateKey: string) {
    this._web3 = web3
    this._ethAccount = web3.eth.accounts.privateKeyToAccount(ethPrivateKey)
    this._ethPlasmaClient = new EthereumPlasmaClient(web3, ADDRESSES.root_chain)

    const dAppClient = createTestHttpClient()
    // TODO: move keys to config file
    const privKey = CryptoUtils.generatePrivateKey()
    const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
    dAppClient.txMiddleware = [
      new NonceTxMiddleware(pubKey, dAppClient),
      new SignedTxMiddleware(privKey)
    ]
    const callerAddress = new Address('default', LocalAddress.fromPublicKey(pubKey))
    this._dAppPlasmaClient = new DAppChainPlasmaClient({ dAppClient, callerAddress })
  }

  async transferTokenAsync(params: {
    slot: BN
    prevBlockNum: BN
    denomination: BN | number
    newOwner: Entity
  }) {
    const { slot, prevBlockNum, denomination, newOwner } = params
    const tx = new PlasmaCashTx({
      slot,
      prevBlockNum,
      denomination,
      newOwner: newOwner.ethAddress
    })
    await tx.signAsync(new Web3Signer(this._web3, this.ethAddress))
    await this._dAppPlasmaClient.sendTxAsync(tx)
  }

  getPlasmaCoinAsync(slot: BN): Promise<IPlasmaCoin> {
    return this._ethPlasmaClient.getPlasmaCoinAsync({ slot, from: this.ethAddress })
  }

  async submitPlasmaBlockAsync(): Promise<BN> {
    await this._dAppPlasmaClient.debugFinalizeBlockAsync()
    const blockNum = await this._dAppPlasmaClient.getCurrentPlasmaBlockNumAsync()
    const block = await this._dAppPlasmaClient.getPlasmaBlockAtAsync(blockNum)
    await this._ethPlasmaClient.debugSubmitBlockAsync({ block, from: this.ethAddress })
    return blockNum
  }

  async submitPlasmaDepositAsync(deposit: IPlasmaDeposit): Promise<void> {
    const tx = new PlasmaCashTx({
      slot: deposit.slot,
      prevBlockNum: deposit.blockNumber,
      denomination: deposit.denomination,
      newOwner: deposit.from
    })
    await this._dAppPlasmaClient.debugSubmitDepositAsync(tx)
  }

  async startExitAsync(params: { slot: BN; prevBlockNum: BN; exitBlockNum: BN }): Promise<object> {
    const { slot, prevBlockNum, exitBlockNum } = params

    // In case the sender is exiting a Deposit transaction, they should just create a signed
    // transaction to themselves. There is no need for a merkle proof.
    if (exitBlockNum.modn(CHILD_BLOCK_INTERVAL) !== 0) {
      const exitTx = new PlasmaCashTx({
        slot,
        prevBlockNum: new BN(0),
        denomination: 1,
        newOwner: this.ethAddress
      })
      await exitTx.signAsync(new Web3Signer(this._web3, this.ethAddress))
      return this._ethPlasmaClient.startExitAsync({
        slot,
        exitTx,
        exitBlockNum,
        from: this.ethAddress,
        gas: DEFAULT_GAS
      })
    }

    // Otherwise, they should get the raw tx info from the blocks, and the merkle proofs.
    const exitBlock = await this._dAppPlasmaClient.getPlasmaBlockAtAsync(exitBlockNum)
    const exitTx = await exitBlock.findTxWithSlot(slot)
    if (!exitTx) {
      throw new Error(`Invalid exit block: missing tx for slot ${slot.toString(10)}.`)
    }
    const prevBlock = await this._dAppPlasmaClient.getPlasmaBlockAtAsync(prevBlockNum)
    const prevTx = await prevBlock.findTxWithSlot(slot)
    if (!prevTx) {
      throw new Error(`Invalid prev block: missing tx for slot ${slot.toString(10)}.`)
    }
    return this._ethPlasmaClient.startExitAsync({
      slot,
      prevTx,
      exitTx,
      prevBlockNum,
      exitBlockNum,
      from: this.ethAddress,
      gas: DEFAULT_GAS
    })
  }

  finalizeExitsAsync(): Promise<object> {
    return this._ethPlasmaClient.finalizeExitsAsync({ from: this.ethAddress, gas: DEFAULT_GAS })
  }

  withdrawAsync(slot: BN): Promise<object> {
    return this._ethPlasmaClient.withdrawAsync({ slot, from: this.ethAddress, gas: DEFAULT_GAS })
  }

  withdrawBondsAsync(): Promise<object> {
    return this._ethPlasmaClient.withdrawBondsAsync({ from: this.ethAddress, gas: DEFAULT_GAS })
  }

  async challengeAfterAsync(params: { slot: BN; challengingBlockNum: BN }): Promise<object> {
    const { slot, challengingBlockNum } = params
    const challengingBlock = await this._dAppPlasmaClient.getPlasmaBlockAtAsync(
      challengingBlockNum
    )
    const challengingTx = await challengingBlock.findTxWithSlot(slot)
    if (!challengingTx) {
      throw new Error(`Invalid challenging block: missing tx for slot ${slot.toString(10)}.`)
    }
    return this._ethPlasmaClient.challengeAfterAsync({
      slot,
      challengingBlockNum,
      challengingTx,
      from: this.ethAddress,
      gas: DEFAULT_GAS
    })
  }
}
