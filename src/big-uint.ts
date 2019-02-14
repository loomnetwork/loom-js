import BN from 'bn.js'

import { bufferToProtobufBytes } from './crypto-utils'
import { BigUInt } from './proto/loom_pb'

export function unmarshalBigUIntPB(value: BigUInt): BN {
  const bytes = value.getValue_asU8()
  const buf = Buffer.from(bytes.buffer as ArrayBuffer, bytes.byteOffset, bytes.byteLength)
  return new BN(buf, 10, 'be')
}

export function marshalBigUIntPB(value: BN): BigUInt {
  const buf = value.toArrayLike(Buffer as any, 'be') as Uint8Array
  const pb = new BigUInt()
  pb.setValue(bufferToProtobufBytes(buf))
  return pb
}