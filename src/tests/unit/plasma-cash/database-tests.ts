import test from 'tape'

import { PlasmaDB } from '../../../plasma-cash/db'
import { PlasmaCashTx } from '../../../plasma-cash/plasma-cash-tx'
import BN from 'bn.js'

test('Database', t => {
  try {
    const uid = `${Math.random() * 10e16}`
    const db = new PlasmaDB('0x', '0x', '0x', uid)

    const slot = new BN('9fe41685a061deda', 16)
    const blkNumber = new BN('7d0', 16) // 2000
    const prevBlk = new BN('3e8', 16) // 1000
    const newOwner = '0x3d5cf1f50c7124acbc6ea69b96a912fe890619d0'
    const tx = new PlasmaCashTx({ slot, prevBlockNum: prevBlk, denomination: 1, newOwner })

    db.receiveCoin(slot, blkNumber, true, tx)
    let coinData = db.getCoin(slot)
    t.equal(coinData.length, 1, 'should receive the coin correctly')
    t.ok(coinData[0].slot.eq(slot), 'slots should be equal')

    // Simulate disconnecting and reconnecting
    const db2 = new PlasmaDB('0x', '0x', '0x', uid)

    db2.receiveCoin(slot, blkNumber, true, tx)
    coinData = db2.getCoin(slot)
    t.equal(coinData.length, 1, 'should not add a duplicate coin')
    t.ok(coinData[0].slot.eq(slot), 'slots should be equal')

    const blkNumber2 = new BN('bb8', 16) // 3000
    const prevBlk2 = new BN('7d0', 16) // 2000
    const tx2 = new PlasmaCashTx({ slot, prevBlockNum: prevBlk2, denomination: 1, newOwner })
    db2.receiveCoin(slot, blkNumber2, true, tx2)

    coinData = db2.getCoin(slot)
    t.equal(coinData.length, 2, 'should receive the new coin')
    t.ok(coinData[1].slot.eq(slot), 'slots should be equal')

    const slot2 = new BN('325f4cae865afba7', 16)
    const tx3 = new PlasmaCashTx({ slot, prevBlockNum: prevBlk, denomination: 1, newOwner })

    db2.receiveCoin(slot2, blkNumber2, true, tx3)
    coinData = db2.getAllCoins()
    t.equal(coinData.length, 3, 'should receive the new coin')

    let slots = db2.getAllCoinSlots()
    t.ok(slots[0].eq(slot), 'slots should be equal')
    t.ok(slots[1].eq(slot2), 'slots should be equal')

    const tx_ret = db2.getTx(slot, blkNumber)
    t.deepEqual(tx, tx_ret, 'Retrieved tx should match the one initially set')

    db2.removeCoin(slot)
    coinData = db2.getAllCoins()
    t.equal(coinData.length, 1, 'should delete instances of the coin')
    slots = db2.getAllCoinSlots()
    t.ok(slots[0].eq(slot2), 'slots should be equal')

    db2.saveBlock(slot, blkNumber)
    db2.saveBlock(slot2, blkNumber)
    db2.saveBlock(slot, blkNumber2)
    const b = db2.getBlock(slot)
    t.ok(blkNumber2.eq(b), 'should be able to save block numbers')
  } catch (err) {
    console.log(err)
  }
  t.end()
})
