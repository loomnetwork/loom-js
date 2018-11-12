import BN from 'bn.js'

/**
 * Wrapper for a Web3 ERC721 contract.
 */
export class EthErc721Contract {
  contract: any // TODO: type this properly

  /**
   * @param contract Web3 contract instance.
   */
  constructor(contract: any) {
    this.contract = contract
  }

  async balanceOfAsync(address: string): Promise<BN> {
    const balance = await this.contract.methods.balanceOf(address).call()
    return new BN(balance)
  }
}
