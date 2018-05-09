import ripemd160 from 'ripemd160'

import { bufferToProtobufBytes } from './crypto-utils'
import * as pb from './proto/loom_pb'

export class LocalAddress {
  constructor(public bytes: Uint8Array) {}

  isEmpty(): boolean {
    return this.bytes && this.bytes.length === 0
  }

  toString(): string {
    // TODO: checksum encoding like go-loom
    return (
      '0x' +
      Buffer.from(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength).toString('hex')
    )
  }

  static fromHexString(hexAddr: string): LocalAddress {
    if (!hexAddr.startsWith('0x')) {
      throw new Error('hexAddr argument has no 0x prefix')
    }
    const bytes = Buffer.from(hexAddr.slice(2), 'hex')
    if (bytes.length != 20) {
      throw new Error(`Invalid local address, expected 20 bytes, got ${bytes.length}`)
    }
    return new LocalAddress(bytes)
  }

  /**
   * Converts a public key to a local address (which is used as unique identifier within a DAppChain).
   * @param publicKey 32-byte public key.
   * @returns Array of bytes representing a local address.
   */
  static fromPublicKey(publicKey: Uint8Array): LocalAddress {
    if (publicKey.length !== 32) {
      throw new Error(`Invalid public key, expected 32 bytes, go ${publicKey.length}`)
    }
    const hasher = new ripemd160()
    hasher.update(Buffer.from(publicKey.buffer, publicKey.byteOffset, publicKey.byteLength))
    return new LocalAddress(hasher.digest())
  }
}

export class Address {
  constructor(public chainId: string, public local: LocalAddress) {}

  isEmpty(): boolean {
    return this.chainId === '' && this.local.isEmpty()
  }

  toString(): string {
    return `${this.chainId}:${this.local.toString()}`
  }

  MarshalPB(): pb.Address {
    const addr = new pb.Address()
    addr.setChainId(this.chainId)
    addr.setLocal(bufferToProtobufBytes(this.local.bytes))
    return addr
  }

  static UmarshalPB(pb: pb.Address): Address {
    return new Address(pb.getChainId(), new LocalAddress(pb.getLocal_asU8()))
  }
}