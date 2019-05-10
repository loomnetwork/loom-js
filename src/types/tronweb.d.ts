declare module 'tronweb' {
  export class TronWeb {
    sha3(msg: string)
    constructor(e: any, r: any, ...args: any[])
    setAddress(publicAddress: string)
    setPrivateKey(privatekey: string)
    getEventResult(contractAddress: string, contractName: string)
    trx: {
      sign(transaction: string, ...args: any[])
      signMessage(...args: any[])
    }
  }

  export default TronWeb
}
