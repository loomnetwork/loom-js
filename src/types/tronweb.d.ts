declare module 'tronweb' {
  export class TronWeb {
    constructor(e: any, r: any, ...args: any[])
    getEventResult(contractAddress: string, contractName: string)
    setAddress(publicAddress: string)
    setPrivateKey(privatekey: string)
    sha3(msg: string)
    trx: {
      sign(transaction: string, ...args: any[])
      signMessage(...args: any[])
    }
  }

  export default TronWeb
}
