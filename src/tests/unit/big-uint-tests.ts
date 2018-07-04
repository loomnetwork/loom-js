import test from 'tape'
import BN from 'bn.js'

import { marshalBigUIntPB, unmarshalBigUIntPB } from '../../big-uint'
import { bytesToHex, bufferToProtobufBytes } from '../../crypto-utils'
import { EmbeddedBigUInt } from '../tests_pb'

test('BigUInt', t => {
  try {
    const pb = new EmbeddedBigUInt()
    pb.setTestVal(marshalBigUIntPB(new BN(10)))
    const hex = bytesToHex(pb.serializeBinary())
    t.equal(hex, '0A030A010A', 'Correctly encoded in protobuf')

    const pb2 = EmbeddedBigUInt.deserializeBinary(bufferToProtobufBytes(Buffer.from(hex, 'hex')))
    const val = unmarshalBigUIntPB(pb2.getTestVal()!)
    t.equal(new BN(10).cmp(val), 0, 'Correctly decoded from protobuf')
  } catch (err) {
    console.log(err)
  }
  t.end()
})
