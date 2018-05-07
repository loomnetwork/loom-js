import test from 'tape'

import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'
import { Dummy, HelloRequest, HelloResponse } from './tests_pb'

test('Contract Calls', async t => {
  try {
    const privKey = generatePrivateKey()
    const pubKey = publicKeyFromPrivateKey(privKey)
    const client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:47000/queryws'
    )
    client.txMiddleware = [new NonceTxMiddleware(pubKey, client), new SignedTxMiddleware(privKey)]

    const contractAddr = new Address(
      client.chainId,
      LocalAddress.fromHexString('0x005B17864f3adbF53b1384F2E6f2120c6652F779')
    )
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const contract = new Contract({ contractAddr, contractName: 'helloworld', callerAddr, client })

    const value = '456'
    const msg = new Dummy()
    msg.setKey('123')
    msg.setValue(value)
    await contract.callAsync<void>('SetMsg', msg)

    msg.setValue('')
    const result = await contract.staticCallAsync<Dummy>('GetMsg', msg, new Dummy())
    t.ok(result, 'Query result must be returned')
    if (result) {
      t.equal(result.getValue(), value, 'Query result must match previously set value')
    }
    client.disconnect()
  } catch (err) {
    console.log(err)
  }
  t.end()
})
