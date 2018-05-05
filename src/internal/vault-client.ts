import wretch from 'wretch'
import { Wretcher } from 'wretch/dist/wretcher'

export interface IVaultResponse {
  request_id: string
}

export interface IVaultCreateTokenRequest {
  access_token: string
}

export interface IVaultCreateTokenResponse {
  auth: { client_token: string }
}

export interface IVaultStorePrivateKeyRequest {
  privateKey: string
}

export interface IVaultGetPrivateKeyResponse extends IVaultResponse {
  data: { privateKey: string }
}

export interface IVaultListSecretsResponse extends IVaultResponse {
  data: { keys: string[] }
}

export class VaultClient {
  private _url?: string

  token?: string

  constructor(url: string, token?: string) {
    this._url = url
    this.token = token
  }

  private get _endpoint(): Wretcher {
    const w = wretch(this._url)
    return this.token ? w.headers({ 'X-Vault-Token': this.token }) : w
  }

  listAsync(path: string): Promise<IVaultListSecretsResponse> {
    return this._endpoint
      .url(path)
      .query({ list: true })
      .get()
      .json<IVaultListSecretsResponse>()
  }

  getAsync<T>(path: string): Promise<T> {
    return this._endpoint
      .url(path)
      .get()
      .json<T>()
  }

  async putAsync<T>(
    path: string,
    data: IVaultCreateTokenRequest | IVaultStorePrivateKeyRequest
  ): Promise<T | void> {
    const body = await this._endpoint
      .url(path)
      .json(data)
      .post()
      .text()
    return body ? JSON.parse(body) : undefined
  }
}
