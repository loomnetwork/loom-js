import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import {
  createTestClient,
  execAndWaitForMillisecondsAsync,
  waitForMillisecondsAsync
} from '../helpers'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'

const Web3 = require('web3')

test('LoomProvider + Subscribe', async t => {
  let client
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()
    client.on('error', msg => console.error('error', msg))
    const from = LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(privKey)
    ).toString()
    const loomProvider = new LoomProvider(client, privKey)

    const ABI = [
      {
        constant: false,
        inputs: [{ name: '_value', type: 'uint256' }],
        name: 'set',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'get',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
        name: 'NewValueSet',
        type: 'event'
      }
    ]

    const contractData =
      '608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029'

    const result = await deployContract(loomProvider, contractData)
    const web3 = new Web3(loomProvider)
    const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

    const id = 1

    const ethSubscribeNewHardsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_subscribe',
        params: ['newHeads', {}]
      })
    )

    t.equal(ethSubscribeNewHardsResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSubscribeNewHardsResult.result),
      'Filter identification should be returned on eth_subscribe'
    )

    await waitForMillisecondsAsync(5000)

    await contract.methods.set(1).send({ from })

    const ethUnsubscribeNewHeadsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_unsubscribe',
        params: [ethSubscribeNewHardsResult.result]
      })
    )

    t.equal(ethUnsubscribeNewHeadsResult.id, id, `Id for eth_unsubscribe should be equal ${id}`)
    t.assert(ethUnsubscribeNewHeadsResult.result, 'Unsubscribed for newHeads')

    const ethSubscribeLogsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_subscribe',
        params: ['logs', {}]
      })
    )

    t.equal(ethSubscribeLogsResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSubscribeLogsResult.result),
      'Filter identification should be returned on eth_subscribe'
    )

    const ethUnsubscribeLogsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_unsubscribe',
        params: [ethSubscribeLogsResult.result]
      })
    )

    t.equal(ethUnsubscribeLogsResult.id, id, `Id for eth_unsubscribe should be equal ${id}`)
    t.assert(ethUnsubscribeLogsResult.result, 'Unsubscribed for Logs')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
