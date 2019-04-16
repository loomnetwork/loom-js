// FIXME: ScatterJS Core don't have any typings
declare module 'eosjs-ecc' {
  declare function PublicKey(data: string)
  declare function randomKey(): Promise<any>
  declare function privateToPublic(wif: any): any
  declare function sign(data: string | Buffer, privateKey: any, encoding: string = 'utf-8'): string
  declare function signHash(
    data: string | Buffer,
    privateKey: any,
    encoding: string = 'utf-8'
  ): string
  declare function sha256(
    data: string | Buffer,
    resultEncoding: string = 'hex',
    encoding: string = 'hex'
  ): string
}
