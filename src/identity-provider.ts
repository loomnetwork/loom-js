import nacl from 'tweetnacl'

import { IKeyStore } from './key-store-factory'
import { generatePrivateKey, publicKeyFromPrivateKey } from './crypto-utils'

export class Identity {
  username: string

  constructor(username: string, privateKey: Uint8Array) {
    this.username = username
    this.privateKey = privateKey
  }

  // 64-byte private key.
  get privateKey(): Uint8Array | undefined {
    return this._privateKey64
  }

  set privateKey(value: Uint8Array | undefined) {
    if (value) {
        this._privateKey64 = value
        this._publicKey32 = publicKeyFromPrivateKey(this._privateKey64);
    } else {
        this._privateKey64 = undefined;
        this._publicKey32 = undefined;
    }
  }

  // 32-byte public key.
  // Note that public key is generated from the private key, so the PrivateKey property must
  // be set before this property will contain a valid public key.
  get publicKey(): Uint8Array | undefined {
    return this._publicKey32
  }

  set publicKey(value: Uint8Array | undefined) {
    this._publicKey32 = value
  }

  private _privateKey64?: Uint8Array
  private _publicKey32?: Uint8Array
}

export class IdentityProvider {
  constructor(public accessToken: string, public keyStore: IKeyStore) {}

  async getIdentityAsync(username: string): Promise<Identity> {
    const keys = await this.keyStore.getKeysAsync()
    if (keys.length > 0) {
      // existing account
      var parts = keys[0].split('/') // TODO: This doesn't really do much atm
      var privateKey = await this.keyStore.getPrivateKeyAsync(keys[0])
      return new Identity(parts[parts.length - 1], privateKey)
    } else {
      return this.createIdentityAsync(username)
    }
  }

  // TODO: maybe expose this publicly and don't call it from getIdentityAsync
  private async createIdentityAsync(username: string): Promise<Identity> {
    const identity = new Identity(username, generatePrivateKey())
    await this.keyStore.setAsync(username, identity.privateKey!)
    return identity
  }
}
