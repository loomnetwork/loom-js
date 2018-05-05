import {
  VaultClient,
  IVaultCreateTokenResponse,
  IVaultCreateTokenRequest
} from './internal/vault-client'
import { VaultStore } from './internal/vault-store'

export class VaultStoreConfig {
  private _vaultPrefix?: string

  // Vault HTTPS endpoint (required).
  url?: string

  get vaultPrefix(): string | undefined {
    return this._vaultPrefix
  }
  set vaultPrefix(value: string | undefined) {
    this._vaultPrefix = value!.endsWith('/') ? value : value + '/'
  }

  // Access token obtained from AuthClient (required).
  accessToken?: string
}

export interface IKeyStore {
  setAsync(key: string, privateKey: Uint8Array): Promise<void>
  getPrivateKeyAsync(key: string): Promise<Uint8Array>
  getKeysAsync(): Promise<string[]>
}

// Creates key stores.
export class KeyStoreFactory {
  static async createVaultStore(cfg: VaultStoreConfig): Promise<IKeyStore> {
    if (!cfg.url) {
      throw new Error('Vault store URL not set.')
    }
    if (!cfg.accessToken) {
      throw new Error('Vault store access token not set.')
    }
    // exchange the Auth0 access token for a Vault client token
    var vaultClient = new VaultClient(cfg.url)
    var resp = await vaultClient.putAsync<IVaultCreateTokenResponse>('auth/auth0/create_token', {
      access_token: cfg.accessToken
    })
    if (resp) {
      vaultClient.token = resp.auth.client_token
    } else {
      throw new Error('Failed to obtain Vault client token.')
    }
    return new VaultStore(vaultClient, cfg.vaultPrefix)
  }
}
