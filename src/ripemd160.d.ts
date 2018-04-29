declare module 'ripemd160' {
  export class RIPEMD160 {
    update(data: string | Uint8Array): this
    digest(encoding: 'hex'): string
  }
}
