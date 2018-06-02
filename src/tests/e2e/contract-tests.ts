import test from 'tape'

import {
  Contract,
  Address,
  LocalAddress,
  Client,
  IChainEventArgs,
  NonceTxMiddleware,
  SignedTxMiddleware,
  CryptoUtils
} from '../../index'
import { MapEntry } from '../tests_pb'
import { createTestClient } from '../helpers'

async function getClientAndContract(): Promise<{ client: Client; contract: Contract }> {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createTestClient()
  client.txMiddleware = [new NonceTxMiddleware(pubKey, client), new SignedTxMiddleware(privKey)]

  let contractAddr: Address | null = null
  try {
    contractAddr = await client.getContractAddressAsync('BluePrint')
    if (!contractAddr) {
      throw new Error()
    }
  } catch {
    throw new Error('Failed to resolve contract address')
  }
  const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  const contract = new Contract({ contractAddr, callerAddr, client })
  return { client, contract }
}

test('Contract Calls', async t => {
  try {
    const { client, contract } = await getClientAndContract()

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
    t.fail(err)
  }
  t.end()
})

test('Contract Events', async t => {
  try {
    const { client, contract } = await getClientAndContract()

    const msgKey = '123'
    const msgValue = '456'
    const msg = new MapEntry()
    msg.setKey(msgKey)
    msg.setValue(msgValue)

    let listener1InvokeCount = 0
    let listener2InvokeCount = 0

    const listener1 = (event: IChainEventArgs) => {
      t.deepEqual(
        event.contractAddress,
        contract.address,
        'IChainEventArgs.contractAddress matches'
      )
      t.deepEqual(event.callerAddress, contract.caller, 'IChainEventArgs.callerAddress matches')
      t.ok(event.blockHeight, 'IChainEventArgs.blockHeight is set')
      t.ok(event.data.length > 0, 'IChainEventArgs.data is set')
      const dataStr = Buffer.from(event.data as Buffer).toString('utf8')
      const dataObj = JSON.parse(dataStr)
      t.deepEqual(
        dataObj,
        { Method: 'SetMsg', Key: msgKey, Value: msgValue },
        'IChainEventArgs.data is correct'
      )
      listener1InvokeCount++
    }
    contract.once(Contract.EVENT, listener1)

    await contract.callAsync<void>('SetMsg', msg)

    const listener2 = (event: IChainEventArgs) => {
      listener2InvokeCount++
    }
    contract.on(Contract.EVENT, listener2)

    await contract.callAsync<void>('SetMsg', msg)
    await contract.callAsync<void>('SetMsg', msg)

    t.isEqual(listener1InvokeCount, 1, 'Contract.once listener invoked only once')
    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener invoked multiple times')

    contract.removeListener(Contract.EVENT, listener2)

    await contract.callAsync<void>('SetMsg', msg)

    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener not invoked after removal')

    client.disconnect()
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
