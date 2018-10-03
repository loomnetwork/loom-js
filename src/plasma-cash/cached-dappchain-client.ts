import { DAppChainPlasmaClient } from './dappchain-client'
import { Client, Address, PlasmaDB, PlasmaCashTx } from '..'
import BN from 'bn.js'

export class CachedDAppChainPlasmaClient extends DAppChainPlasmaClient {
  private _database: PlasmaDB

  constructor(params: {
    dAppClient: Client
    callerAddress: Address
    database: PlasmaDB
    contractName?: string
  }) {
    const { dAppClient, callerAddress, database, contractName = 'plasmacash' } = params
    super({ dAppClient, callerAddress, contractName })
    this._database = database
  }

  async getPlasmaTxAsync(slot: BN, blockNum: BN): Promise<PlasmaCashTx> {
    let tx: PlasmaCashTx
    if (this._database.exists(slot.toString(16), blockNum.toString())) {
      tx = this._database.getTx(slot.toString(16), blockNum.toString())
    } else {
      tx = await super.getPlasmaTxAsync(slot, blockNum)
      this._database.receiveCoin(slot.toString(16), blockNum.toString(), tx)
    }
    return tx
  }

  getAllCoins(): BN[] {
    const coins = this._database.getAllCoins()

    // Get unique keys, O(N) complexity, can't go lower
    let unique: any = {};
    let distinct: any = [];
    for (let i in coins) {
      if (typeof (unique[coins[i].slot]) == "undefined") {
        distinct.push(coins[i].age);
      }
      unique[coins[i].age] = 0;
    }

    // @ts-ignore
    return distinct.map(s => new BN(s, 16))
  }
}