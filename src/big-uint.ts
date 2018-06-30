import BN from 'bn.js'

import { bufferToProtobufBytes } from './crypto-utils'

export function unmarshalBigUIntPB(value: Uint8Array): BN {
  const buf = Buffer.from(value.buffer as ArrayBuffer, value.byteOffset, value.byteLength)
  return new BN(buf, 10, 'be')
}

export function marshalBigUIntPB(value: BN): Uint8Array {
  return bufferToProtobufBytes(value.toArrayLike(Buffer as any, 'be') as Uint8Array)
}
