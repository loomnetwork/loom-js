import test, { Test } from 'tape'
import BN from 'bn.js'
import {
  Address,
  Contracts,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient, getTestUrls } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'
import { LoomProvider } from '../../loom-provider'
import Web3 from 'web3'
import { getJsonRPCSignerAsync, EthersSigner, soliditySha3 } from '../../solidity-helpers'
import { deployContractGanache, deployContract } from '../evm-helpers'

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  acct1Client: Client
  acct2Client: Client
  transferGateway: Contracts.TransferGateway
  addressMapper: Contracts.AddressMapper
  acct1PubKey: Uint8Array
  acct2PubKey: Uint8Array
  web3Loom: Web3
  web3Ganache: Web3
  loomContractAddress: string
  ganacheConctractAddress: string
  ganacheContractHash: string
}> {
  const acct1PrivKey = B64ToUint8Array(
    'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
  )

  const acct2PrivKey = B64ToUint8Array(
    '3bpboaOX/8R2XPS6q6SmhGq+RBvs+3DDkWXayy58lIC+9k1Sj1K0BEQb82OcLZ8Ivkh9EL5/hWgXLKu3vNLc/g=='
  )

  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(acct1PrivKey)
  const acct2PubKey = CryptoUtils.publicKeyFromPrivateKey(acct2PrivKey)
  const acct1Client = createClient()
  const acct2Client = createClient()

  acct1Client.txMiddleware = createDefaultTxMiddleware(acct1Client, acct1PrivKey)
  acct2Client.txMiddleware = createDefaultTxMiddleware(acct2Client, acct2PrivKey)

  const transferGateway = await Contracts.TransferGateway.createAsync(
    acct1Client,
    new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )

  const addressMapper = await Contracts.AddressMapper.createAsync(
    acct1Client,
    new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )

  const loomProvider = new LoomProvider(acct1Client, acct1PrivKey)
  const web3Loom = new Web3(loomProvider)
  const web3Ganache = new Web3('http://localhost:8545')

  const contractData =
    '608060405234801561001057600080fd5b50600a600081905550610118806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60e3565b6040518082815260200191505060405180910390f35b806000819055507fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b6000546040518082815260200191505060405180910390a150565b600080549050905600a165627a7a72305820fabe42649c29e53c4b9fad19100d72a1e825603058e1678432a76f94a10d352a0029'

  const loomDeployedContractResults = await deployContract(loomProvider, contractData)
  const ganacheDeployedContractResults = await deployContractGanache(web3Ganache, contractData)

  const loomContractAddress = loomDeployedContractResults.contractAddress
  const ganacheConctractAddress = ganacheDeployedContractResults.contractAddress
  const ganacheContractHash = ganacheDeployedContractResults.transactionHash

  return {
    acct1Client,
    acct2Client,
    transferGateway,
    addressMapper,
    acct1PubKey,
    acct2PubKey,
    web3Loom,
    web3Ganache,
    loomContractAddress,
    ganacheConctractAddress,
    ganacheContractHash
  }
}

test('Should gateway owner authorize contract mapping', async (t: Test) => {
  const {
    acct1Client,
    loomContractAddress,
    ganacheConctractAddress,
    transferGateway
  } = await getClientAndContract(createTestHttpClient)

  const localContract = new Address(
    acct1Client.chainId,
    LocalAddress.fromHexString(loomContractAddress)
  )
  const foreignContract = new Address('eth', LocalAddress.fromHexString(ganacheConctractAddress))

  await transferGateway.addAuthorizedContractMappingAsync({ foreignContract, localContract })
  const contractsAuthorized = await transferGateway.listContractMappingsAsync()

  const match = contractsAuthorized.confirmed.find(({ from, to }) => {
    return (
      `eth:${ganacheConctractAddress.toLowerCase()}` == to.toString() &&
      `default:${loomContractAddress.toLowerCase()}` == from.toString()
    )
  })

  t.assert(match, 'Contracts should be confirmed')

  t.end()
})

test('Should user mapping contracts on gateway', async (t: Test) => {
  const {
    acct1Client,
    transferGateway,
    loomContractAddress,
    ganacheConctractAddress,
    ganacheContractHash
  } = await getClientAndContract(createTestHttpClient)

  const localContract = new Address(
    acct1Client.chainId,
    LocalAddress.fromHexString(loomContractAddress)
  )

  const foreignContract = new Address('eth', LocalAddress.fromHexString(ganacheConctractAddress))

  const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 0)
  const ethersSigner = new EthersSigner(ethers)
  const hash = soliditySha3(
    { type: 'address', value: foreignContract.local.toString().slice(2) },
    { type: 'address', value: localContract.local.toString().slice(2) }
  )

  const foreignContractCreatorSig = await ethersSigner.signAsync(hash)
  const foreignContractCreatorTxHash = Buffer.from(ganacheContractHash.slice(2), 'hex')

  const params = {
    foreignContract,
    localContract,
    foreignContractCreatorSig,
    foreignContractCreatorTxHash
  }

  await transferGateway.addContractMappingAsync(params)

  t.end()
})
