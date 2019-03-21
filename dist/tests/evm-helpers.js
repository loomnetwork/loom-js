"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var address_1 = require("../address");
var __1 = require("..");
function deployContract(loomProvider, contractData) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, fromAddr, ethSendTransactionDeployResult, ethGetTransactionReceiptResult;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = loomProvider.accounts.values().next().value;
                    if (!privKey) {
                        throw Error('Private key not found on deploy contract helper');
                    }
                    fromAddr = address_1.LocalAddress.fromPublicKey(__1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 100,
                            method: 'eth_sendTransaction',
                            params: [
                                {
                                    from: fromAddr,
                                    data: contractData,
                                    gas: '0x0',
                                    gasPrice: '0x0',
                                    value: '0x0'
                                }
                            ]
                        })];
                case 1:
                    ethSendTransactionDeployResult = _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 200,
                            method: 'eth_getTransactionReceipt',
                            params: [ethSendTransactionDeployResult.result]
                        })];
                case 2:
                    ethGetTransactionReceiptResult = _a.sent();
                    return [2 /*return*/, ethGetTransactionReceiptResult.result];
            }
        });
    });
}
exports.deployContract = deployContract;
//# sourceMappingURL=evm-helpers.js.map