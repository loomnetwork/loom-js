import Web3 from 'web3';
declare class SignedContract {
    account: any;
    contract: any;
    address: string;
    web3: Web3;
    readonly instance: any;
    constructor(web3: Web3, abi: any, address: string, account: Account);
    wrapConstant(func: string): void;
    signedFunc(func: string): void;
}
export default SignedContract;
