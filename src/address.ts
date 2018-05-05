import ripemd160 from 'ripemd160'

import * as pb from './proto/loom_pb'

export class LocalAddress {
  constructor(public bytes: Uint8Array) {}

  isEmpty(): boolean {
    return this.bytes && this.bytes.length === 0
  }

  toString(): string {
    // TODO: checksum encoding like go-loom
    return '0x' + Buffer.from(this.bytes.buffer).toString('hex')
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
    hasher.update(Buffer.from(publicKey.buffer))
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
    // Buffer in Node is a Uint8Array, but someone broke it in Protobuf 3.4.0, so have to wait
    // for https://github.com/google/protobuf/pull/4378 to make into a release (maybe 3.5.3)
    // so that https://github.com/google/protobuf/issues/1319 is fixed... no one seems to be
    // in any rush to push out a new release though.
    // In the meantime work around the issue by copying the Buffer into a plain Uint8Array
    if ((<any>this.local.bytes).constructor === Buffer) {
      addr.setLocal(new Uint8Array(this.local.bytes))
    } else {
      addr.setLocal(this.local.bytes)
    }
    return addr
  }

  static UmarshalPB(pb: pb.Address): Address {
    return new Address(pb.getChainId(), new LocalAddress(pb.getLocal_asU8()))
  }
}
