import { Entity } from '../../../plasma-cash/entity'
import BN from 'bn.js'

export class MockEntity extends Entity {
  currBlock!: BN

  getCurrentBlockAsync(): Promise<BN> {
    return new Promise((resolve, err) => resolve(this.currBlock))
  }
}
