import test from 'tape'

import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { Client } from '../client'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'
import { Dummy, HelloRequest, HelloResponse } from './tests_pb'

test('Contract Calls', async t => {
  const privKey = generatePrivateKey()
  const pubKey = publicKeyFromPrivateKey(privKey)
  const client = new Client('default', 'http://localhost:46657', 'http://localhost:47000')
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
  /*
    msg.setValue('')
    const result = await contract.staticCallAsync<Dummy>('GetMsg', msg)
    t.ok(result, "Query result must be returned")
    if (result) {
        t.equal(result.getValue(), value)
    }
    */
  t.end()
})
