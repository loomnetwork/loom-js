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

  get database(): PlasmaDB {
    return this._database
  }

  async getPlasmaTxAsync(slot: BN, blockNum: BN): Promise<PlasmaCashTx> {
    let tx: PlasmaCashTx
    if (this._database.exists(slot, blockNum)) {
      tx = this._database.getTx(slot, blockNum)
    } else {
      tx = await super.getPlasmaTxAsync(slot, blockNum)
      this._database.receiveCoin(slot, blockNum, tx)
    }
    return tx
  }

  getAllCoins(): BN[] {
    return this._database.getAllCoinSlots()
  }
}
