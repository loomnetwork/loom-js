import test from 'tape'

import { MockEntity } from './mock-entity'
import BN from 'bn.js'
import Web3 from 'web3'
import { IEntityParams } from '../../../plasma-cash/entity'

test('Entity', async t => {
  try {
    let web3 = new Web3()
    let params: any = { childBlockInterval: 1000 }
    const entity = new MockEntity(web3, params)

    let blks, expected, startBlock

    startBlock = new BN(3)
    entity.currBlock = new BN(1000)
    blks = await entity.getBlockNumbersAsync(startBlock)
    expected = [new BN(3), new BN(1000)]
    t.deepEqual(blks, expected, 'blocks should match')

    startBlock = new BN(1003)
    entity.currBlock = new BN(1000)
    blks = await entity.getBlockNumbersAsync(startBlock)
    expected = [new BN(1003)]
    t.deepEqual(blks, expected, 'blocks should match')

    startBlock = new BN(5000)
    entity.currBlock = new BN(5000)
    blks = await entity.getBlockNumbersAsync(startBlock)
    expected = [new BN(5000)]
    t.deepEqual(blks, expected)

    startBlock = new BN(1003)
    entity.currBlock = new BN(5000)
    blks = await entity.getBlockNumbersAsync(startBlock)
    expected = [new BN(1003), new BN(2000), new BN(3000), new BN(4000), new BN(5000)]
    t.deepEqual(blks, expected)
  } catch (err) {
    console.log(err)
  }
  t.end()
})
