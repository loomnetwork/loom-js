import test, { Test } from 'tape'
import {
  Address,
  Contracts,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient, waitForMillisecondsAsync } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'
import { LoomProvider } from '../../loom-provider'
import Web3 from 'web3'
import { getJsonRPCSignerAsync, EthersSigner, soliditySha3 } from '../../solidity-helpers'

const loomToken = require('./artifacts/LoomToken.json')
const validatorManager = require('./artifacts/ValidatorManagerContract.json')
const gateway = require('./artifacts/Gateway.json')
const sampleERC20MintableToken = require('./artifacts/SampleERC20MintableToken.json')
const sampleERC20Token = require('./artifacts/SampleERC20Token.json')

// Deploy and return the contract also the txHash
async function deployContract(
  web3Contract: any,
  from: string,
  bytecode: any,
  params: any[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    let txHash: any

    web3Contract
      .deploy({
        data: bytecode,
        arguments: params
      })
      .send({
        from,
        gas: '6721975'
      })
      .on('transactionHash', (txHashResult: string) => {
        txHash = txHashResult
      })
      .then((contractDeployed: any) => {
        contractDeployed.txHash = txHash
        resolve(contractDeployed)
      })
      .catch(reject)
  })
}

async function getClientAndContract(createClient: () => Client) {
  // Dappchain private keys
  const dappChainPrivKeys = [
    'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ==',
    '3bpboaOX/8R2XPS6q6SmhGq+RBvs+3DDkWXayy58lIC+9k1Sj1K0BEQb82OcLZ8Ivkh9EL5/hWgXLKu3vNLc/g=='
  ].map(B64ToUint8Array)

  // Main net private keys (ganache)
  const mainNetPrivKeys = [
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
    '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1'
  ]

  // Main net address (ganache)
  const mainNetAddresses = [
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
  ]

  // Dappchain pub keys
  const dappChainPubKeys = dappChainPrivKeys.map(CryptoUtils.publicKeyFromPrivateKey)

  // Setting up clients with the middlewares
  const clients = [createClient(), createClient()].map((client, idx) => {
    client.txMiddleware = createDefaultTxMiddleware(client, dappChainPrivKeys[idx])
    return client
  })

  // Bind to transfer gateway
  const transferGateway = await Contracts.TransferGateway.createAsync(
    clients[0],
    new Address(clients[0].chainId, LocalAddress.fromPublicKey(dappChainPubKeys[0]))
  )

  // Creates Web3 for Loom
  const web3Loom = new Web3(new LoomProvider(clients[0], dappChainPrivKeys[0]))

  // Creates Web3 for Main net (ganache)
  const web3MainNet = new Web3('http://localhost:8545')

  // Creates contracts to deploy
  const loomTokenContract = new web3MainNet.eth.Contract(loomToken.abi)
  const validatorManagerContract = new web3MainNet.eth.Contract(validatorManager.abi)
  const gatewayContract = new web3MainNet.eth.Contract(gateway.abi)
  const sampleERC20MintableTokenContract = new web3MainNet.eth.Contract(
    sampleERC20MintableToken.abi
  )
  const sampleERC20TokenContract = new web3Loom.eth.Contract(sampleERC20Token.abi)

  // Deploy Loom token on main net
  const loomTokenDeployed = await deployContract(
    loomTokenContract,
    mainNetAddresses[0],
    loomToken.bytecode,
    []
  )

  // Deploy validator manager on main net
  const validators = [mainNetAddresses[0]]
  const powers = [1]
  const threshold_num = 2
  const threshold_denom = 3

  const validatorManagerDeployed = await deployContract(
    validatorManagerContract,
    mainNetAddresses[0],
    validatorManager.bytecode,
    [validators, powers, threshold_num, threshold_denom, loomTokenDeployed.options.address]
  )

  // Deploy gateway on main net
  const gatewayDeployed = await deployContract(
    gatewayContract,
    mainNetAddresses[0],
    gateway.bytecode,
    [validatorManagerDeployed.options.address]
  )

  // Deploy game token on main net
  const sampleERC20MintableTokenDeployed = await deployContract(
    sampleERC20MintableTokenContract,
    mainNetAddresses[0],
    sampleERC20MintableToken.bytecode,
    [gatewayDeployed.options.address]
  )

  // Deploy game token on loomchain
  const sampleERC20TokenDeployed = await deployContract(
    sampleERC20TokenContract,
    LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(dappChainPrivKeys[0])
    ).toString(),
    sampleERC20Token.bytecode,
    [gatewayDeployed.options.address]
  )

  return {
    clients,
    sampleERC20MintableTokenDeployed,
    sampleERC20TokenDeployed,
    transferGateway
  }
}

test('Should gateway owner authorize contract mapping', async (t: Test) => {
  const {
    clients,
    sampleERC20MintableTokenDeployed,
    sampleERC20TokenDeployed,
    transferGateway
  } = await getClientAndContract(createTestHttpClient)

  const localContract = new Address(
    clients[0].chainId,
    LocalAddress.fromHexString(sampleERC20TokenDeployed.options.address)
  )
  const foreignContract = new Address(
    'eth',
    LocalAddress.fromHexString(sampleERC20MintableTokenDeployed.options.address)
  )

  await transferGateway.addAuthorizedContractMappingAsync({ foreignContract, localContract })
  const contractsAuthorized = await transferGateway.listContractMappingsAsync()

  const match = contractsAuthorized.confirmed.find(({ from, to }) => {
    return (
      `eth:${sampleERC20MintableTokenDeployed.options.address.toLowerCase()}` == to.toString() &&
      `default:${sampleERC20TokenDeployed.options.address.toLowerCase()}` == from.toString()
    )
  })

  t.assert(match, 'Contracts should be confirmed')

  t.end()
})

test.only('Should user mapping contracts on gateway', async (t: Test) => {
  const {
    clients,
    sampleERC20MintableTokenDeployed,
    sampleERC20TokenDeployed,
    transferGateway
  } = await getClientAndContract(createTestHttpClient)

  const localContract = new Address(
    clients[0].chainId,
    LocalAddress.fromHexString(sampleERC20TokenDeployed.options.address)
  )

  const foreignContract = new Address(
    'eth',
    LocalAddress.fromHexString(sampleERC20MintableTokenDeployed.options.address)
  )

  const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 0)
  const ethersSigner = new EthersSigner(ethers)
  const hash = soliditySha3(
    { type: 'address', value: foreignContract.local.toString().slice(2) },
    { type: 'address', value: localContract.local.toString().slice(2) }
  )

  const foreignContractCreatorSig = await ethersSigner.signAsync(hash)
  const foreignContractCreatorTxHash = Buffer.from(
    sampleERC20MintableTokenDeployed.txHash.slice(2),
    'hex'
  )

  const params = {
    foreignContract,
    localContract,
    foreignContractCreatorSig,
    foreignContractCreatorTxHash
  }

  await transferGateway.addContractMappingAsync(params)

  const contractsAuthorized = await transferGateway.listContractMappingsAsync()

  console.log(JSON.stringify(contractsAuthorized))

  const match = contractsAuthorized.confirmed.find(({ from, to }) => {
    return (
      `eth:${sampleERC20MintableTokenDeployed.options.address.toLowerCase()}` == to.toString() &&
      `default:${sampleERC20TokenDeployed.options.address.toLowerCase()}` == from.toString()
    )
  })

  t.assert(match, 'Contracts should be confirmed')

  t.end()
})
