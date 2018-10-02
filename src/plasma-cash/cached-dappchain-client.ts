import { DAppChainPlasmaClient } from './dappchain-client'
import { Client, Address, PlasmaDB, PlasmaCashTx } from '..'
import BN from 'bn.js'
import {keys, countBy} from 'lodash'

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
      const slots: string[] = keys(countBy(coins, (c) => c.slot))
      return slots.map(s => new BN(s, 16))
  }
}
