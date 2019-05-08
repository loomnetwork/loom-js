/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="node" />
declare module 'tronweb' {

    export class TronWeb {
        constructor(e: any, r: any, ...args: any[]);
        contract(...args: any[]): any;
        currentProvider(): any;
        currentProviders(): any;
        getEventByTransactionID(transactionID: string, callback?: any): any;
        getEventResult(...args: any[]): any;
        isConnected(callback?: any): any;
        isValidProvider(provider: any): any;
        setAddress(address: any): void;
        setDefaultBlock(blockID: any): any;
        setEventServer(eventServer: any): any;
        setFullNode(fullNode: any): void;
        setPrivateKey(privateKey: any): void;
        setSolidityNode(solidityNode: any): void;
        createAccount(callback?: any): Promise<any>;
        fromAscii(string: any, padding: any): any;
        fromDecimal(value: any): any;
        fromSun(sun: any): any;
        fromUtf8(string: any): any;
        isAddress(address: string): any;
        sha3(string: any, prefix?: boolean): any;
        toAscii(hex: any): any;
        toBigNumber(amount: number): any;
        toDecimal(value: any): any;
        toHex(val: any): any;
        toSun(trx: any): any;
        toUtf8(hex: any): any;
    }


    export namespace TronWeb {
        export namespace trx {
            function sign(transaction: any, privateKey: any, useTronHeader: boolean, callback?: any): Promise<any>;
            function updateAccount(accountName: string, options: any,  callback?: any): Promise<any>;
            function signMessage(...args: any[]): Promise<any>;
            function signTransaction(...args: any[]): Promise<any>;
        }

        namespace transactionBuilder {
            function sendTrx(to: any, amount: any, from: any, callback?: any): Promise<any>;
            function sendToken(to: any, amount: any, tokenID: any, from: any, callback?: any): Promise<any>;
            function purchaseToken(issuerAddress: any, tokenID: any, amount: any, buyer: any, callback?: any): Promise<any>;
            function freezeBalance(amount: any, duration: number, resource: string, address: any, callback?: any): Promise<any>;
            function unfreezeBalance(resource: string, address: any, callback?: any): Promise<any>;
            function withdrawBlockRewards(address: any, callback?: any): Promise<any>;
            function applyForSR(address: any, url: any, callback?: any): Promise<any>;
            function vote(votes: any, voterAddress: any, callback?: any): Promise<any>;
            function createToken(options: any, issuerAddress: any, callback?: any): Promise<any>;
            function updateAccount(accountName: any, address: any, callback?: any): Promise<any>;
            function updateToken(options: any, issuerAddress: any, callback?: any): Promise<any>;
            function sendAsset(...args: any[]): Promise<any>;
            function purchaseAsset(...args: any[]): Promise<any>;
            function createAsset(...args: any[]): Promise<any>;
            function updateAsset(...args: any[]): Promise<any>;
            function createProposal(parameters: any, issuerAddress: any, callback?: any): Promise<any>;
            function deleteProposal(proposalID: any, issuerAddress: any, callback?: any): Promise<any>;
            function voteProposal(proposalID: any, isApproval: any, voterAddress: any, callback?: any): Promise<any>;
            function createTRXExchange(tokenName: any, tokenBalance: any, trxBalance: any, ownerAddress: any): Promise<any>;
            function createTokenExchange(firstTokenName: any, firstTokenBalance: any, secondTokenName: any, secondTokenBalance: any, ownerAddress: any, callback?: any): Promise<any>;
            function injectExchangeTokens(exchangeID: any, tokenName: any, tokenAmount: any, ownerAddress: any, callback?: any): Promise<any>;
            function withdrawExchangeTokens(exchangeID: any, tokenName: any, tokenAmount: any, ownerAddress: any, callback?: any): Promise<any>;
            function tradeExchangeTokens(exchangeID: any, tokenName: any, tokenAmountSold: any, tokenAmountExpected: any, ownerAddress: any, callback?: any): Promise<any>;
        }

        namespace address {
            function fromHex(e: any): any;
            function fromPrivateKey(e: any): any;
            function toHex(e: any): any;
        }
    }

    export default TronWeb;
}