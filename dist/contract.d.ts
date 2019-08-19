import { Message } from 'google-protobuf';
import EventEmitter from 'events';
import { Client } from './client';
import { Address } from './address';
/**
 * The Contract class streamlines interaction with a contract that was deployed on a Loom DAppChain.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(contract: Contract) {
 *   contract.on(Contract.EVENT, (event: IChainEventArgs) => {
 *     const dataStr = Buffer.from(event.data as Buffer).toString('utf8')
 *     const dataObj = JSON.parse(dataStr)
 *     console.log('Contract Event: ' + dataStr)
 *   })
 * }
 */
export declare class Contract extends EventEmitter {
    static readonly EVENT: string;
    private _client;
    name?: string;
    address: Address;
    caller: Address;
    /**
     * @param params Parameters.
     * @param params.contractAddr Address of a contract on the Loom DAppChain.
     * @param params.contractName Name of the contract.
     * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
     *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
     * @param params.client: Client to use to communicate with the contract.
     */
    constructor(params: {
        contractAddr: Address;
        contractName?: string;
        callerAddr: Address;
        client: Client;
    });
    /**
     * Calls a contract method that mutates state.
     * The call into the contract is accomplished by committing a tx to the DAppChain.
     * @param method Contract method to call.
     * @param args Arguments to pass to the contract method.
     * @returns A promise that will be resolved with return value (if any) of the contract method.
     */
    callAsync<T extends Message | void>(method: string, args: Message, output?: T): Promise<T | void>;
    /**
     * Calls a contract method that doesn't mutate state.
     * This method is usually used to query the current contract state, it doesn't commit any txs.
     * @param method Contract method to call.
     * @param args Arguments to pass to the contract method.
     * @returns A promise that will be resolved with the return value of the contract method.
     */
    staticCallAsync<T extends Message>(method: string, args: Message, output: T): Promise<T>;
    private _emitContractEvent;
}
