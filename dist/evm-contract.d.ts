import EventEmitter from 'events';
import { Client } from './client';
import { Address } from './address';
/**
 * The EvmContract class streamlines interaction with a contract that was
 * deployed on a Loom DAppChain EVM.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API.
 */
export declare class EvmContract extends EventEmitter {
    static readonly EVENT: string;
    private _client;
    address: Address;
    caller: Address;
    /**
     * @param params Parameters.
     * @param params.contractAddr Address of a contract on the Loom DAppChain EVM.
     * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
     *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
     * @param params.client: Client to use to communicate with the contract.
     */
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    /**
     * Calls a contract method that mutates state.
     * The call into the contract is accomplished by committing a tx to the DAppChain.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with return value (if any) of the contract method.
     */
    callAsync(args: number[], output?: Uint8Array): Promise<Uint8Array | void>;
    /**
     * Calls a method of a contract running on an EVM that doesn't mutate state.
     * This method is usually used to query the current contract state, it doesn't commit any txs.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with the return value of the contract method.
     */
    staticCallAsync(args: number[], output?: Uint8Array): Promise<Uint8Array | void>;
    private _emitContractEvent;
}
