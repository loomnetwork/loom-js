import test from 'tape'

import { LocalAddress, CryptoUtils, Contracts } from '../../../index'
import { createTestClient, execAndWaitForMillisecondsAsync, getTestUrls } from '../../helpers'
import { LoomProvider } from '../../../loom-provider'
import { deployContract } from '../../evm-helpers'
import { LoomProvider2 } from '../../../loom-provider-2'
import { Address } from '../../../address'
import { getJsonRPCSignerAsync, EthersSigner } from '../../../solidity-helpers'
import { createDefaultTxMiddleware } from '../../../helpers'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */

const bootstrapLoomProviderTest = async () => {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createTestClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)
  const loomProviderLegacy = new LoomProvider(client, privKey)

  const contractData =
    '0x608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029'

  await deployContract(loomProviderLegacy, contractData)

  client.on('error', msg => console.error('Error on client:', msg))

  const addressMapper = await Contracts.AddressMapper.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  const ethAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  const ecdsaKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const ethFrom = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 0)
  const ethersSigner = new EthersSigner(ethers)

  if (!(await addressMapper.hasMappingAsync(ethFrom))) {
    await addressMapper.addIdentityMappingAsync(ethFrom, to, ethersSigner)
  }

  client.disconnect()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth, ecdsaKey)

  return {
    loomProvider
  }
}

test('LoomProvider2 + Filters (1)', async t => {
  const { loomProvider } = await bootstrapLoomProviderTest()

  try {
    // Transaction receipt in order to obtain the topic of the event NewValueSet
    const ethNewFilterResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 10,
        method: 'eth_newFilter',
        params: [{ toBlock: 'latest' }]
      })
    )

    t.assert(/0x.+/.test(ethNewFilterResult.result), 'New id should be created for new filter')

    const ethNewBlockFilter = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 11,
        method: 'eth_newBlockFilter'
      })
    )

    t.assert(
      /0x.+/.test(ethNewBlockFilter.result),
      'New id should be created for new block filter'
    )

    const ethGetFilterChanges = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 12,
        method: 'eth_getFilterChanges',
        params: [ethNewBlockFilter.result]
      })
    )

    t.assert(
      ethGetFilterChanges.result.length > 0,
      'Get filter changes should return array with new blocks'
    )

    const ethUninstallFilterResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 13,
        method: 'eth_uninstallFilter',
        params: [ethNewBlockFilter.result]
      })
    )

    t.deepEqual(ethUninstallFilterResult.result, true, 'Should uninstall filter and return true')
  } catch (err) {
    t.error(err)
  }

  loomProvider.disconnect()
  t.end()
})

test('LoomProvider2 + Filters (2)', async t => {
  const { loomProvider } = await bootstrapLoomProviderTest()

  try {
    const ethNewBlockFilter = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 11,
        method: 'eth_newBlockFilter'
      })
    )

    t.assert(
      /0x.+/.test(ethNewBlockFilter.result),
      'New id should be created for new block filter'
    )

    const ethGetFilterChanges = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 12,
        method: 'eth_getFilterChanges',
        params: [ethNewBlockFilter.result]
      })
    )

    t.assert(ethGetFilterChanges.result.length > 0, 'Should return filter changes')

    const ethGetBlockByHash = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 13,
        method: 'eth_getBlockByHash',
        params: [ethGetFilterChanges.result[0], true]
      })
    )

    t.assert(ethGetBlockByHash.result, 'Should return the block requested by hash')
  } catch (err) {
    t.error(err)
  }

  loomProvider.disconnect()
  t.end()
})
