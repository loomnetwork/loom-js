import test from 'tape'
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
  SignedTxMiddleware
} from '../../index'
import { createTestHttpClient } from '../helpers'

let web3: Web3

// Alice registers and has 5 coins, and she deposits 3 of them.
const ALICE_INITIAL_COINS = 5
const ALICE_DEPOSITED_COINS = 3
const COINS = [1, 2, 3]
const DEFAULT_GAS = '3141592'

// TODO: these should be pulled out of a config file generated by a Truffle migration
const ADDRESSES = {
  validator_manager: '0xf5cad0db6415a71a5bc67403c87b56b629b4ddaa',
  root_chain: '0x9e51aeeeca736cd81d27e025465834b8ec08628a',
  token_contract: '0x1aa76056924bf4768d63357eca6d6a56ec929131'
}

// TODO: these should be pulled out of a config file generated by a Truffle migration
const ACCOUNTS = {
  authority: '0x7920ca01d3d1ac463dfd55b5ddfdcbb64ae31830f31be045ce2d51a305516a37',
  alice: '0xbb63b692f9d8f21f0b978b596dc2b8611899f053d68aec6c1c20d1df4f5b6ee2',
  bob: '0x2f615ea53711e0d91390e97cdd5ce97357e345e441aa95d255094164f44c8652',
  charlie: '0x7d52c3f6477e1507d54a826833169ad169a56e02ffc49a1801218a7d87ca50bd',
  dan: '0x6aecd44fcb79d4b68f1ee2b2c706f8e9a0cd06b0de4729fe98cfed8886315256',
  mallory: '0x686e245584fdf696abd739c0e66ac6e01fc4c68babee20c7124566e118b2a634',
  eve: '0x9fd4ab25e1699bb252f4d5c4510a135db34b3adca8baa03194ad5cd6faa13a1d',
  trudy: '0xe8445efa4e3349c3c74fd6689553f93b55aca723115fb777e1e6f4db2a0a82ca'
}

// All the contracts are expected to have been deployed to Ganache when this function is called.
function setupContracts() {
  web3 = new Web3('http://localhost:8545')
  const abi = require('./contracts/cards-abi.json')
  const cards = new web3.eth.Contract(abi, ADDRESSES.token_contract)
  return { cards }
}

interface IPlasmaDeposit {
  slot: BN
  blockNumber: BN
  denomination: BN
  from: string
}

class Entity {
  // web3 account
  private _ethAccount: any // TODO: type this properly
  private _dAppPlasmaClient: DAppChainPlasmaClient
  private _ethPlasmaClient: EthereumPlasmaClient

  get ethAddress(): string {
    return this._ethAccount.address
  }

  constructor(ethPrivateKey: string) {
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
    await tx.signAsync(this._ethAccount)
    await this._dAppPlasmaClient.sendTxAsync(tx)
  }

  async submitPlasmaBlockAsync() {
    await this._dAppPlasmaClient.debugFinalizeBlockAsync()
    // TODO: retrieve plasma block from DAppChain
    await this._ethPlasmaClient.debugSubmitBlockAsync()
  }
}

test('Exit of UTXO 2 (Coin 3) - Directly after its deposit', async t => {
  const { cards } = setupContracts()
  const authority = new Entity(ACCOUNTS.authority)
  const alice = new Entity(ACCOUNTS.alice)

  console.log('giving alice tokens')
  await cards.methods.register().send({ from: alice.ethAddress, gas: DEFAULT_GAS })
  let balance = await cards.methods.balanceOf().call({ from: alice.ethAddress })
  t.equal(balance.toNumber(), 5)

  console.log('depositing alice tokens to plasma contract')

  const deposits: IPlasmaDeposit[] = []
  for (let i = 0; i < ALICE_DEPOSITED_COINS; i++) {
    const txReceipt = await cards.methods
      .depositToPlasma(COINS[i])
      .send({ from: alice.ethAddress, gas: DEFAULT_GAS })
    console.log(JSON.stringify(txReceipt, null, '  '))
    deposits.push(txReceipt.events['Deposit'].returnValues)
  }

  console.log('deposited alice tokens to plasma contract')

  balance = await cards.methods.balanceOf().call({ from: alice.ethAddress })
  t.equal(
    balance.toNumber(),
    ALICE_INITIAL_COINS - ALICE_DEPOSITED_COINS,
    'alice should have 2 tokens in cards contract'
  )
  balance = await cards.methods.balanceOf().call({ from: ADDRESSES.root_chain })
  t.equal(
    balance.toNumber(),
    ALICE_DEPOSITED_COINS,
    'plasma contract should have 3 tokens in cards contract'
  )

  for (let i = 0; i < deposits.length; i++) {
    const deposit = deposits[i]
    t.equal(deposit.blockNumber.toNumber(), i + 1)
    t.equal(deposit.denomination.toNumber(), 1)
    t.equal(deposit.from, alice)
  }

  // Alice to Bob, and Alice to Charlie. We care about the Alice to Bob
  // transaction
  const bob = new Entity(ACCOUNTS.bob)
  const charlie = new Entity(ACCOUNTS.charlie)
  const deposit3 = deposits[2]
  const deposit2 = deposits[1]
  // Alice -> Bob
  await alice.transferTokenAsync({
    slot: deposit3.slot,
    prevBlockNum: deposit3.blockNumber,
    denomination: 1,
    newOwner: bob
  })
  // Alice -> Charlie
  await alice.transferTokenAsync({
    slot: deposit2.slot,
    prevBlockNum: deposit2.blockNumber,
    denomination: 1,
    newOwner: charlie
  })
  await authority.submitPlasmaBlockAsync()
  // Bob -> Charlie
  await bob.transferTokenAsync({
    slot: deposit3.slot,
    prevBlockNum: new BN(1000),
    denomination: 1,
    newOwner: charlie
  })
  await authority.submitPlasmaBlockAsync()

  // TODO: exits
  t.end()
})
