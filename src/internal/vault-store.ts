import { IKeyStore } from '../key-store-factory'
import { B64ToUint8Array, Uint8ArrayToB64 } from '../crypto-utils'
import { VaultClient, IVaultGetPrivateKeyResponse } from './vault-client'

export class VaultStore implements IKeyStore {
  private _client: VaultClient
  private _prefix: string

  constructor(client: VaultClient, prefix: string = '') {
    this._client = client
    this._prefix = 'entcubbyhole/' + prefix
  }

  setAsync(key: string, privateKey: Uint8Array): Promise<void> {
    return this._client.putAsync(this._prefix + key, { privateKey: Uint8ArrayToB64(privateKey) })
  }

  async getPrivateKeyAsync(key: string): Promise<Uint8Array> {
    var resp = await this._client.getAsync<IVaultGetPrivateKeyResponse>(this._prefix + key)
    return B64ToUint8Array(resp.data.privateKey)
  }

  async getKeysAsync(): Promise<string[]> {
    try {
      var resp = await this._client.listAsync(this._prefix)
      if (resp != null) {
        return resp.data.keys
      }
    } catch (e) {
      // allow 404 on path to pass
      if (e.Errors != null && e.Errors.Length > 0) {
        throw e
      }
    }
    return []
  }
}
