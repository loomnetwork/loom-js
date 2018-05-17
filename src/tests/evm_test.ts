import test from 'tape'

import { EvmContract } from '../evmcontract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'
import { types } from 'util'

test('Contract Calls', async t => {
  try {
    const privKey = generatePrivateKey()
    const pubKey = publicKeyFromPrivateKey(privKey)
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws'
    )
    client.txMiddleware = [new NonceTxMiddleware(pubKey, client), new SignedTxMiddleware(privKey)]

    const contractAddr = new Address(
      client.chainId,
      LocalAddress.fromHexString('0xbD770416A3345f91E4b34576Cb804a576Fa48eB1')
    )
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const evmContract = new EvmContract({
      contractAddr,
      callerAddr,
      client
    })

    const inputSet987Array: number[] = [
      96,
      254,
      71,
      177,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      219
    ]
    const inputGetArray: number[] = [109, 76, 230, 60]

    const rtv = await evmContract.callAsync(inputSet987Array)

    const retVal = await evmContract.staticCallAsync(inputGetArray)

    const retArr = Array.prototype.slice.call(retVal, 0)
    const expectedRtv = inputSet987Array.slice(-32)
    t.deepEqual(retArr, expectedRtv, 'Query result must match previously set')

    client.disconnect()
  } catch (err) {
    console.log(err)
  }
  t.end()
})
