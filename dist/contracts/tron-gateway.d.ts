import { TransferGateway } from './transfer-gateway';
import { Client } from '../client';
import { Address } from '../address';
export declare class TronTransferGateway extends TransferGateway {
    static createAsync(client: Client, callerAddr: Address): Promise<TronTransferGateway>;
}
