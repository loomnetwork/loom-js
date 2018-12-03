import { TransferGateway } from "./transfer-gateway"
import { Client } from "../client";
import { Address } from "../address";

export class LoomCoinTransferGateway extends TransferGateway {

  static async createAsync(
    client: Client,
    callerAddr: Address,
  ): Promise<TransferGateway> {
    const contractAddr = await client.getContractAddressAsync('loomcoin-gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for TransferGateway')
    }

    return new LoomCoinTransferGateway({ contractAddr, callerAddr, client })
  }
}
