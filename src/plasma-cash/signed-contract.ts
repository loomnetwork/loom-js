import { providers, Contract } from 'ethers'

// Converts any contract to a signed contract
class SignedContract {
  ethAddress: string
  contract: Contract
  address: string
  wallet: providers.JsonRpcSigner

  get instance(): any {
    return this.contract
  }

  constructor(wallet: providers.JsonRpcSigner, abi: any, address: string, ethAddress: string) {
    // Get the function names from the ABI
    this.wallet = wallet
    this.address = address
    this.ethAddress = ethAddress
    const mutable = abi.filter((element: any) => element.type === 'function' && !element.constant)
    const nonMutable = abi.filter(
      (element: any) => element.type === 'function' && element.constant
    )
    const mutableFuncNames: string[] = mutable.map((f: any) => f.name)
    const nonMutableFuncNames: string[] = nonMutable.map((f: any) => f.name)

    this.contract = new Contract(address, abi, wallet)
    // Create a signed function for each
    mutableFuncNames.map(func => this.signedFunc(func))
    nonMutableFuncNames.map(func => {
      this.wrapConstant(func)
    })
  }

  wrapConstant(func: string) {
    const method = this.contract.methods[func]
    const wrappedNonConstant = async (...args: any[]): Promise<any> => {
      return method(...args).call()
    }
    // @ts-ignore
    this.contract[func] = wrappedNonConstant
  }

  // Will sign the tx
  signedFunc(func: string) {
    const method = this.contract.methods[func]
    const wrappedFunction = async (args: any[], value?: string): Promise<any> => {
      const data = method(...args).encodeABI()
      const to = this.address
      const nonce = await this.wallet.getTransactionCount()

      const tx: any = {
        to: to,
        data: data,
        chainId: (await this.wallet.provider.getNetwork()).chainId,
        nonce: nonce,
        value: value ? value : 0
      }

      let gas
      try {
        gas = await method(...args).estimateGas({ from: this.ethAddress, value: value })
      } catch (e) {
        gas = 300000 // default gas amount
      }
      tx['gas'] = Math.ceil(gas * 1.25) // give some extra gas and round the decimal

      // Sign the raw transaction
      // TODO: Check if this makes sense
      const signedTx = await this.wallet.sendTransaction(tx)

      // @ts-ignore
      // Bug in ts-types
      return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    }
    // @ts-ignore
    this.contract[func] = wrappedFunction
  }
}

export default SignedContract
