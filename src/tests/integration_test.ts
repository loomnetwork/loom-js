import test from 'tape'

import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'
import { MapEntry, HelloRequest, HelloResponse } from './tests_pb'
import { VMType } from '../proto/loom_pb'

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

    const contractAddr = await client.getContractAddressAsync('BluePrint')
    if (!contractAddr) {
      t.fail('Failed to resolve contract address')
      return
    }
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const contract = new Contract({ contractAddr, callerAddr, client })

    const msgKey = '123'
    const msgValue = '456'
    const msg = new MapEntry()
    msg.setKey(msgKey)
    msg.setValue(msgValue)
    await contract.callAsync<void>('SetMsg', msg)

    const retVal = await contract.callAsync<MapEntry>('SetMsgEcho', msg, new MapEntry())
    t.ok(retVal, 'Value must be returned from helloworld.SetMsgEcho')
    if (retVal) {
      t.equal(retVal.getKey(), msgKey, 'Key must match the one that was sent')
      t.equal(retVal.getValue(), msgValue, 'Value must match the one that was sent')
    }

    msg.setValue('')
    const result = await contract.staticCallAsync<MapEntry>('GetMsg', msg, new MapEntry())
    t.ok(result, 'Value must be returned from helloworld.GetMsg')
    if (result) {
      t.equal(result.getValue(), msgValue, 'Query result must match previously set value')
    }

    client.disconnect()
  } catch (err) {
    console.log(err)
  }
  t.end()
})
