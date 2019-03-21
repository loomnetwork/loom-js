import * as pb from './proto/loom_pb';
export declare class LocalAddress {
    bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    isEmpty(): boolean;
    toString(): string;
    toChecksumString(): string;
    equals(other: LocalAddress): boolean;
    static fromHexString(hexAddr: string): LocalAddress;
    /**
     * Converts a public key to a local address (which is used as unique identifier within a DAppChain).
     * @param publicKey 32-byte public key.
     * @returns Array of bytes representing a local address.
     */
    static fromPublicKey(publicKey: Uint8Array): LocalAddress;
}
export declare class Address {
    chainId: string;
    local: LocalAddress;
    constructor(chainId: string, local: LocalAddress);
    isEmpty(): boolean;
    toString(): string;
    MarshalPB(): pb.Address;
    equals(other: Address): boolean;
    /**
     * @deprecated Use the function UnmarshalPB instead
     */
    static UmarshalPB(pb: pb.Address): Address;
    static UnmarshalPB(pb: pb.Address): Address;
    /**
     * Converts a string to an address.
     * @param address String representation of an address, in the format "chain:0x...".
     */
    static fromString(address: string): Address;
}
