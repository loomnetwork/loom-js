import { TransferGateway } from './transfer-gateway';
import { Client } from '../client';
import { Address } from '../address';
import BN from 'bn.js';
export declare class LoomCoinTransferGateway extends TransferGateway {
    static createAsync(client: Client, callerAddr: Address): Promise<LoomCoinTransferGateway>;
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of LOOM from the current
     * DAppChain account to an Ethereum account.
     * @param amount Amount to withdraw.
     * @param mainnetLoomcoinAddress Ethereum address of LOOM coin contract.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    withdrawLoomCoinAsync(amount: BN, mainnetLoomcoinAddress: Address, recipient?: Address): Promise<void>;
}
