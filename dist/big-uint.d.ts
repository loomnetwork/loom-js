import BN from 'bn.js';
import { BigUInt } from './proto/loom_pb';
export declare function unmarshalBigUIntPB(value: BigUInt): BN;
export declare function marshalBigUIntPB(value: BN): BigUInt;
