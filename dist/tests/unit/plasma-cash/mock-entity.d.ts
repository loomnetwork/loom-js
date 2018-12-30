import { Entity } from '../../../plasma-cash/entity';
import BN from 'bn.js';
export declare class MockEntity extends Entity {
    currBlock: BN;
    getCurrentBlockAsync(): Promise<BN>;
}
