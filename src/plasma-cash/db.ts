import low from 'lowdb'
import { PlasmaCashTx } from './plasma-cash-tx'
import BN from 'bn.js'

export interface IDatabaseCoin {
  slot: BN
  blockNumber: BN
  tx: PlasmaCashTx
}

export class PlasmaDB {
  db: any
  constructor(ethereum: String, dappchain: String, plasmaAddress: String, privateKey: String) {
    // If we're on node.js
    let adapter
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const FileSync = require('lowdb/adapters/FileSync')
      adapter = new FileSync(`db/db_${privateKey}.json`)
    } else {
      const LocalStorage = require('lowdb/adapters/LocalStorage')
      adapter = new LocalStorage('db')
    }
    this.db = low(adapter)
    // Initialize the database
    this.db
      .defaults({
        ethereum: ethereum,
        dappchain: dappchain,
        plasma: plasmaAddress,
        privatekey: privateKey,
        coins: []
      })
      .write()
    console.log('Initialized database', this.db.value())
  }

  receiveCoin(coinId: string, block: string, tx: PlasmaCashTx) {
    // Find the coin in the database and add the block/proof.
    // Throw for duplicate block
    if (this.exists(coinId, block)) {
      return
    }

    // @ts-ignore
    tx.proofBytes = Array.from(tx.proofBytes!)
    // @ts-ignore
    tx.sigBytes = Array.from(tx.sigBytes!)
    // Append for new coinId
    const result = this.db
      .get('coins')
      .push({
        slot: coinId,
        block: block,
        tx: tx
      })
      .write()
    // console.log('State updated', result)
  }

  getTx(coinId: string, block: string): PlasmaCashTx {
    const result = this.db
      .get('coins')
      .filter({ slot: coinId, block: block })
      .value()
    const tx = result[0].tx
    return new PlasmaCashTx({
      slot: new BN(tx.slot, 16),
      prevBlockNum: new BN(tx.prevBlockNum, 16),
      denomination: new BN(1),
      newOwner: tx.newOwner,
      prevOwner: tx.prevOwner,
      sig: Uint8Array.from(tx.sigBytes),
      proof: Uint8Array.from(tx.proofBytes)
    })
  }

  exists(coinId: string, block: string): Boolean {
    const result = this.db
      .get('coins')
      .filter({ slot: coinId, block: block })
      .value()
    if (result.length > 0) {
      console.log(`Transaction: ${coinId} at Block: ${block} already exists in local state`)
      return true
    } else {
      return false
    }
  }

  removeCoin(coinId: string) {
    this.db
      .get('coins')
      .remove({ slot: coinId })
      .write()
    console.log(`Coin ${coinId} removed`)
  }

  getCoin(coinId: string): IDatabaseCoin[] {
    return this.db
      .get('coins')
      .filter({ slot: coinId })
      .value()
  }

  getAllCoins(): any {
    return this.db.get('coins').value()
  }
}

// Example -> transform in a test
// const db = new PlasmaDB('localhost:8545', 'localhost:46658', '0x1234', '0x6666')
// const id = 123442112
// db.receiveCoin(id, 0, '0x1234')
// db.receiveCoin(id, 0, '0x9999')
// db.receiveCoin(id, 1, '0x98973')
// db.receiveCoin(id, 2, '0x6666')
// db.receiveCoin(id+1, 2, '0x6666')
// console.log(db.getCoin(id))
// db.removeCoin(id)
// console.log(db.getCoin(id))
//
// console.log(db.getAllCoins())
//
