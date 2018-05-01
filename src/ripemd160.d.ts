declare module 'ripemd160' {
  export default class RIPEMD160 {
    update(data: string | Uint8Array): this
    /**
     * @param encoding 'hex' return a hex-encoded string representing the digest.
     */
    digest(encoding: 'hex'): string
    digest(): Uint8Array
  }
}
