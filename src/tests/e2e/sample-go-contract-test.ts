import test from 'tape'
import {
  Address,
  Contracts,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'

async function getClientAndContract(
  createClient: () => Client,
  privKey: Uint8Array
): Promise<{
  client: Client
  sampleGoContract: Contracts.SampleGoContract
}> {
  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const sampleGoContract = await Contracts.SampleGoContract.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )
  return { client: client, sampleGoContract: sampleGoContract, }
}

test('SampleGoContract', async t => {
  try {
    const privKey = B64ToUint8Array(
      'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
    )

    const {
      client,
      sampleGoContract,
    } = await getClientAndContract(createTestHttpClient, privKey)

    const loomProvider = new LoomProvider(client, privKey)

    const testEventData = "6080604052348015600f57600080fd5b5060b48061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063d0a2d2cb14602d575b600080fd5b605660048036036020811015604157600080fd5b81019080803590602001909291905050506058565b005b807f6c2b4666ba8da5a95717621d879a77de725f3d816709b9cbe9f059b8f875e28460405160405180910390a25056fea165627a7a7230582016f1260ff3c0c4cb4ae77e5671c47dd1bf7428e651451a0713334e14f820a8c50029"
    const testEventDataDeployResult = await deployContract(loomProvider, testEventData)
    const testEventDataAddress = new Address(
      client.chainId,
      LocalAddress.fromHexString(testEventDataDeployResult.contractAddress)
    )

    const chainTestEventData = "608060405234801561001057600080fd5b50610204806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80633163597714610030575b600080fd5b61005c6004803603602081101561004657600080fd5b810190808035906020019092919050505061005e565b005b600060405161006c906100fa565b604051809103906000f080158015610088573d6000803e3d6000fd5b5090508073ffffffffffffffffffffffffffffffffffffffff1663d0a2d2cb836040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b1580156100de57600080fd5b505af11580156100f2573d6000803e3d6000fd5b505050505050565b60d2806101078339019056fe6080604052348015600f57600080fd5b5060b48061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063d0a2d2cb14602d575b600080fd5b605660048036036020811015604157600080fd5b81019080803590602001909291905050506058565b005b807f6c2b4666ba8da5a95717621d879a77de725f3d816709b9cbe9f059b8f875e28460405160405180910390a25056fea165627a7a72305820d39be77fb7bd69477e9bc1d28b88af64b93c72fed5f5506b943573d5cdaf873a0029a165627a7a72305820ebce57a6324c972c70ea583c14e607f393a99d98b23322d9f3b7e1ef339ddef10029"
    const chainTestEventDataDeployResult = await deployContract(loomProvider, chainTestEventData)
    const chainTestEventDataAddress = new Address(
      client.chainId,
      LocalAddress.fromHexString(chainTestEventDataDeployResult.contractAddress)
    )

    console.log("addresses",testEventDataAddress, chainTestEventDataAddress)
    await sampleGoContract.testNestedEvmCalls2Async(testEventDataAddress, chainTestEventDataAddress)

    client.disconnect()
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
