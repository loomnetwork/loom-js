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
import { createTestHttpClient, getTestUrls, waitForMillisecondsAsync } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'
import { LoomProvider } from '../../loom-provider'
import Web3 from 'web3'
import { getJsonRPCSignerAsync, EthersSigner, soliditySha3 } from '../../solidity-helpers'
import { deployContractGanache, deployContract } from '../evm-helpers'
import { gateway, dappChainERC20, mainnetERC20 } from '../contracts_bytecode'

async function getClientAndContract(createClient: () => Client) {
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

  const dappchainERC20DeployedContractResults = await deployContract(loomProvider, dappChainERC20)
  const gatewayDeployedContractResults = await deployContractGanache(web3Ganache, gateway)
  // const mainnetERC20DeployedContractResults = await deployContractGanache(
  //   web3Ganache,
  //   mainnetERC20
  // )

  // const mainnetERC20ContractAddress = mainnetERC20DeployedContractResults.contractAddress
  // const gatewayContractAddress = gatewayDeployedContractResults.contractAddress
  // const dappchainERC20ContractAddress = dappchainERC20DeployedContractResults.contractAddress
  // const mainnetERC20ContractHash = mainnetERC20DeployedContractResults.transactionHash

  return {
    acct1Client,
    acct2Client,
    transferGateway,
    addressMapper,
    acct1PubKey,
    acct2PubKey,
    web3Loom,
    web3Ganache
    // mainnetERC20ContractAddress
    // gatewayContractAddress,
    // dappchainERC20ContractAddress,
    // mainnetERC20ContractHash
  }
}

test('Should gateway owner authorize contract mapping', async (t: Test) => {
  const {
    // acct1Client,
    // dappchainERC20ContractAddress,
    // mainnetERC20ContractAddress,
    // transferGateway
  } = await getClientAndContract(createTestHttpClient)

  // const localContract = new Address(
  //   acct1Client.chainId,
  //   LocalAddress.fromHexString(dappchainERC20ContractAddress)
  // )
  // const foreignContract = new Address(
  //   'eth',
  //   LocalAddress.fromHexString(mainnetERC20ContractAddress)
  // )

  // await transferGateway.addAuthorizedContractMappingAsync({ foreignContract, localContract })
  // const contractsAuthorized = await transferGateway.listContractMappingsAsync()

  // const match = contractsAuthorized.confirmed.find(({ from, to }) => {
  //   return (
  //     `eth:${mainnetERC20ContractAddress.toLowerCase()}` == to.toString() &&
  //     `default:${dappchainERC20ContractAddress.toLowerCase()}` == from.toString()
  //   )
  // })

  // t.assert(match, 'Contracts should be confirmed')

  t.end()
})

// test.only('Should user mapping contracts on gateway', async (t: Test) => {
//   const {
//     acct1Client,
//     transferGateway,
//     loomContractAddress,
//     ganacheConctractAddress,
//     ganacheContractHash
//   } = await getClientAndContract(createTestHttpClient)

//   const localContract = new Address(
//     acct1Client.chainId,
//     LocalAddress.fromHexString(loomContractAddress)
//   )

//   const foreignContract = new Address('eth', LocalAddress.fromHexString(ganacheConctractAddress))

//   const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 0)
//   const ethersSigner = new EthersSigner(ethers)
//   const hash = soliditySha3(
//     { type: 'address', value: foreignContract.local.toString().slice(2) },
//     { type: 'address', value: localContract.local.toString().slice(2) }
//   )

//   const foreignContractCreatorSig = await ethersSigner.signAsync(hash)
//   const foreignContractCreatorTxHash = Buffer.from(ganacheContractHash.slice(2), 'hex')

//   const params = {
//     foreignContract,
//     localContract,
//     foreignContractCreatorSig,
//     foreignContractCreatorTxHash
//   }

//   await transferGateway.addContractMappingAsync(params)

//   waitForMillisecondsAsync(60000)

//   const contractsAuthorized = await transferGateway.listContractMappingsAsync()

//   console.log(JSON.stringify(contractsAuthorized))

//   t.end()
// })
