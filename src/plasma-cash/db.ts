import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import LocalStorage from 'lowdb/adapters/LocalStorage'

class PlasmaDB {
  db: any
  constructor(ethereum: String, dappchain: String, plasmaAddress: String, privateKey: String) {
    // If we're on node.js
    let adapter
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const low = require('lowdb')
      adapter = new FileSync(`db/db_${privateKey}.json`)
    } else {
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

  receiveCoin(coinId: Number, block: Number, proof: String) {
    // Find the coin in the database and add the block/proof.
    // Throw for duplicate block
    // Append for new coinId

    if (this.exists(coinId, block, proof)) {
      return
    }

    const result = this.db
      .get('coins')
      .push({
        id: coinId,
        block: block,
        merkleProof: proof
      })
      .write()
    // console.log('State updated', result)
  }

  exists(coinId: Number, block: Number, proof: String): Boolean {
    const result = this.db
      .get('coins')
      .filter({ id: coinId, block: block })
      .value()
    if (result.length > 0) {
      console.log(`Proof for Coin: ${coinId} at Block: ${block} already exists`)
      return true
    } else {
      return false
    }
  }

  removeCoin(coinId: Number) {
    this.db
      .get('coins')
      .remove({ id: coinId })
      .write()
    console.log(`Coin ${coinId} removed`)
  }

  getCoin(coinId: any): any {
    // todo organize the filter to not return the id in every row
    return this.db
      .get('coins')
      .filter({ id: coinId })
      .value()
  }

  getAllCoins(): any {
    // todo group by coinId
    return this.db.get('coins').value()
  }
}

export default PlasmaDB

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
