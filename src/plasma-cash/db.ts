import low from 'lowdb'
import { PlasmaCashTx } from './plasma-cash-tx'
import BN from 'bn.js'
import fs from 'fs'
import path from 'path'

export interface IDatabaseCoin {
  slot: BN
  blockNumber: BN
  included: boolean
  tx: PlasmaCashTx
}

export class PlasmaDB {
  dbPath: string
  db: any

  constructor(dbPath?: string) {
    // TODO: the db path shouldn't be hardcoded
    // If we're on node.js
    let adapter
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const FileSync = require('lowdb/adapters/FileSync')
      const shelljs = require('shelljs')

      if (dbPath) {
        this.dbPath = dbPath
      } else {
        this.dbPath = `./db/db.json`
      }

      if (!fs.existsSync(this.dbPath)) {
        shelljs.mkdir('-p', path.dirname(this.dbPath))
      }

      adapter = new FileSync(this.dbPath)
    } else {
      const LocalStorage = require('lowdb/adapters/LocalStorage')
      this.dbPath = 'db'
      adapter = new LocalStorage(this.dbPath)
    }
    this.db = low(adapter)
    // Initialize the database
    this.db
      .defaults({
        coins: [],
        blocks: {},
        lastBlock: new BN(0)
      })
      .write()
    // console.log('Initialized database', this.db.value())
  }

  receiveCoin(coinId: BN, block: BN, included: boolean, tx: PlasmaCashTx) {
    // Find the coin in the database and add the block/proof.
    // Throw for duplicate block
    if (this.exists(coinId, block)) {
      return
    }

    // @ts-ignore
    tx.proofBytes = Array.from(tx.proofBytes ? tx.proofBytes : [0, 0, 0, 0, 0, 0, 0, 0])
    // @ts-ignore
    tx.sigBytes = Array.from(tx.sigBytes ? tx.sigBytes : 0)
    // Append for new coinId
    const result = this.db
      .get('coins')
      .push({
        slot: coinId,
        block: block,
        included: included,
        tx: tx
      })
      .write()
    // console.log('State updated', result)
  }

  saveLastBlock(block: BN) {
    const result = this.db.set(`lastBlock`, block).write()
  }

  getLastBlock(): BN {
    const result = this.db.get(`lastBlock`).value()
    return result
  }

  // Get the block at which the owner received the coin
  saveBlock(coinId: BN, block: BN) {
    const result = this.db.set(`blocks.${coinId}`, block).write()
  }

  getBlock(coinId: BN): BN {
    const result = this.db.get(`blocks.${coinId}`).value()
    return result
  }

  getTx(coinId: BN, block: BN): PlasmaCashTx {
    const result = this.db
      .get('coins')
      .filter((c: any) => new BN(c.slot, 16).eq(coinId) && new BN(c.block, 16).eq(block))
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

  exists(coinId: BN, block: BN): Boolean {
    const result = this.db
      .get('coins')
      .filter((c: any) => new BN(c.slot, 16).eq(coinId) && new BN(c.block, 16).eq(block))
      .value()
    if (result.length > 0) {
      // console.log(`Transaction: ${coinId} at Block: ${block} already exists in local state`)
      return true
    } else {
      return false
    }
  }

  removeCoin(coinId: BN) {
    this.db
      .get('coins')
      .remove((c: any) => new BN(c.slot, 16).eq(coinId))
      .write()
    // console.log(`Coin ${coinId} removed`)
  }

  getCoin(coinId: BN): IDatabaseCoin[] {
    // The first time we write to the database we have to filter wihtout toString(16)
    let coins = this.db
      .get('coins')
      .filter((c: any) => new BN(c.slot, 16).eq(coinId))
      .value()
    return coins.map((c: any) => this.marshalDBCoin(c))
  }

  getAllCoins(): any {
    return this.db
      .get('coins')
      .value()
      .map((c: any) => this.marshalDBCoin(c))
  }

  getAllCoinSlots(): BN[] {
    const coins = this.getAllCoins()

    // Get unique keys, O(N) complexity, can't go lower
    let flag: any = {}
    let distinct: BN[] = []
    for (let i in coins) {
      if (flag[coins[i].slot]) continue
      distinct.push(coins[i].slot)
      flag[coins[i].slot] = true
    }
    return distinct
  }

  marshalDBCoin(c: any): IDatabaseCoin {
    return {
      slot: new BN(c.slot, 16),
      included: c.included,
      blockNumber: new BN(c.block, 16),
      tx: new PlasmaCashTx({
        slot: new BN(c.tx.slot, 16),
        prevBlockNum: new BN(c.tx.prevBlockNum, 16),
        denomination: new BN(c.tx.denomination, 16),
        newOwner: c.tx.newOwner,
        sig: c.tx.sigBytes,
        proof: c.tx.proofBytes
      })
    }
  }

  /** Reclaims any space used by the database */
  delete() {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      if (fs.existsSync(this.dbPath)) {
        fs.unlinkSync(this.dbPath)
        try {
          // this will throw an error if the directory isn't empty
          fs.rmdirSync(path.dirname(this.dbPath))
        } catch (err) {}
      }
    } else {
      localStorage.removeItem(this.dbPath)
    }
  }
}
