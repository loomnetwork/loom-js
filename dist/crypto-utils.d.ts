export declare function bytesToHex(bytes: Readonly<Uint8Array>): string;
export declare function numberToHex(num: number): string;
export declare function hexToNumber(hex: string): number;
export declare function hexToBytes(hex: string): Uint8Array;
export declare function bytesToHexAddr(bytes: Uint8Array): string;
export declare function getGUID(): string;
export declare const SIGNATURE_LENGTH: number;
export declare const PRIVATE_KEY_LENGTH: number;
export declare const PUBLIC_KEY_LENGTH: number;
export declare const enum SIGNATURE_TYPE {
    EIP712 = 0,
    GETH = 1,
    TREZOR = 2,
    TRON = 3,
    BINANCE = 4
}
/**
 * Generates a private key for signing.
 * @returns 64-byte private key.
 */
export declare function generatePrivateKey(): Uint8Array;
/**
 * Generates a private key for signing from a seed
 * @param seed Uint8Array with the seed to be used
 * @returns 64-byte private key.
 */
export declare function generatePrivateKeyFromSeed(seed: Uint8Array): Uint8Array;
/**
 * Generates the public key that corresponds to the given private key.
 * @param privateKey 64-byte private key.
 * @returns 32-byte public key.
 */
export declare function publicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array;
/**
 * Signs a message with the given private key.
 * @param msg Message to be signed.
 * @param privateKey 64-byte private key to sign with.
 * @returns The generated signature.
 */
export declare function sign(msg: Uint8Array, privateKey: Uint8Array): Uint8Array;
/**
 * Encodes bytes to a base64 string.
 * @param bytes Array of bytes to encode to string.
 * @returns base64 encoded string.
 */
export declare function Uint8ArrayToB64(bytes: Uint8Array): string;
/**
 * Decodes bytes from a base64 string.
 * @param s String to decode.
 * @returns Array of bytes.
 */
export declare function B64ToUint8Array(s: string): Uint8Array;
export declare function bufferToProtobufBytes(input: Buffer | Uint8Array): Uint8Array;
