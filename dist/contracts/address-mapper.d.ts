import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
import { IEthereumSigner } from '../solidity-helpers';
export interface IAddressMapping {
    from: Address;
    to: Address;
}
export declare class AddressMapper extends Contract {
    static createAsync(client: Client, callerAddr: Address): Promise<AddressMapper>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    addIdentityMappingAsync(from: Address, to: Address, ethersSigner: IEthereumSigner): Promise<Uint8Array | void>;
    /**
     * Similar to addIdentityMappingAsync but for Binance
     */
    addBinanceIdentityMappingAsync(from: Address, to: Address, ethersSigner: IEthereumSigner): Promise<Uint8Array | void>;
    hasMappingAsync(from: Address): Promise<boolean>;
    getMappingAsync(from: Address): Promise<IAddressMapping>;
}
