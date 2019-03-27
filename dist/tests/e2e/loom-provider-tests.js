"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var ethereumjs_util_1 = require("ethereumjs-util");
var solidity_helpers_1 = require("../../solidity-helpers");
var crypto_utils_1 = require("../../crypto-utils");
var Web3 = require('web3');
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.18;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   function set(uint _value) public {
 *     value = _value;
 *   }
 *
 *   function get() public constant returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
var newContractAndClient = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, client, from, loomProvider, contractData, _a, contractAddress, transactionHash;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                contractData = '608060405234801561001057600080fd5b50600a600081905550610118806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60e3565b6040518082815260200191505060405180910390f35b806000819055507fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b6000546040518082815260200191505060405180910390a150565b600080549050905600a165627a7a72305820fabe42649c29e53c4b9fad19100d72a1e825603058e1678432a76f94a10d352a0029';
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                _a = _b.sent(), contractAddress = _a.contractAddress, transactionHash = _a.transactionHash;
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                return [2 /*return*/, { privKey: privKey, client: client, contractData: contractData, contractAddress: contractAddress, transactionHash: transactionHash, from: from, loomProvider: loomProvider }];
        }
    });
}); };
tape_1.default('LoomProvider method eth_sign', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, privKey, client, id, msg, signResult, hash, _b, r, s, v, pubKey, privateHash, err_1;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _c.sent(), loomProvider = _a.loomProvider, from = _a.from, privKey = _a.privKey, client = _a.client;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                id = 1;
                msg = '0xff';
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sign',
                        params: [from, msg]
                    }))];
            case 3:
                signResult = _c.sent();
                hash = solidity_helpers_1.soliditySha3('\x19Ethereum Signed Message:\n32', msg).slice(2);
                _b = ethereumjs_util_1.fromRpcSig(signResult.result), r = _b.r, s = _b.s, v = _b.v;
                pubKey = ethereumjs_util_1.ecrecover(Buffer.from(hash, 'hex'), v, r, s);
                privateHash = solidity_helpers_1.soliditySha3(privKey).slice(2);
                t.equal(crypto_utils_1.bytesToHexAddr(pubKey), crypto_utils_1.bytesToHexAddr(ethereumjs_util_1.privateToPublic(Buffer.from(privateHash, 'hex'))), 'Should pubKey from ecrecover been valid');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                console.log(err_1);
                t.error(err_1, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method net_version', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, netVersionResult, chainIdHash, netVersionFromChainId, err_2;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'net_version'
                    }))];
            case 3:
                netVersionResult = _b.sent();
                chainIdHash = solidity_helpers_1.soliditySha3(client.chainId)
                    .slice(2)
                    .slice(0, 13);
                netVersionFromChainId = new bn_js_1.default(chainIdHash).toNumber();
                t.deepEqual(netVersionResult, {
                    id: 1,
                    jsonrpc: '2.0',
                    result: netVersionFromChainId
                }, 'net_version should match the chain id');
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                console.log(err_2);
                t.error(err_2, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_accounts', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, client, id, ethAccountsResult, err_3;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_accounts'
                    }))];
            case 3:
                ethAccountsResult = _b.sent();
                t.deepEqual(ethAccountsResult, {
                    id: 1,
                    jsonrpc: '2.0',
                    result: [from]
                }, 'accounts should be available on eth_accounts command');
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                console.log(err_3);
                t.error(err_3, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_newBlockFilter', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, ethNewBlockFilterResult, err_4;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_newBlockFilter'
                    }))];
            case 3:
                ethNewBlockFilterResult = _b.sent();
                t.equal(ethNewBlockFilterResult.id, id, "Id for eth_newBlockFilter should be equal " + id);
                t.assert(/0x.+/.test(ethNewBlockFilterResult.result), 'Hex identification should be returned on eth_newBlockFilter');
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                console.log(err_4);
                t.error(err_4, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_blockNumber', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, ethBlockNumber, err_5;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_blockNumber'
                    }))];
            case 3:
                ethBlockNumber = _b.sent();
                t.equal(ethBlockNumber.id, id, "Id for eth_blockNumber should be equal " + id);
                t.assert(ethBlockNumber.result, 'JSON RPC result should be set');
                t.equal(ethBlockNumber.result.indexOf('0x'), 0, 'Block number should be hex-encoded');
                return [3 /*break*/, 5];
            case 4:
                err_5 = _b.sent();
                console.log(err_5);
                t.error(err_5, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_getBlockByNumber (0x1)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, ethNewBlockByNumberResult, err_6;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getBlockByNumber',
                        params: ['0x1']
                    }))];
            case 3:
                ethNewBlockByNumberResult = _b.sent();
                t.assert(ethNewBlockByNumberResult.result, 'Block should be returned from eth_getBlockByNumber');
                return [3 /*break*/, 5];
            case 4:
                err_6 = _b.sent();
                console.log(err_6);
                t.error(err_6, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_getBlockByNumber (latest)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, ethNewBlockByNumberResultLatest, err_7;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getBlockByNumber',
                        params: ['latest', false]
                    }))];
            case 3:
                ethNewBlockByNumberResultLatest = _b.sent();
                t.equal(ethNewBlockByNumberResultLatest.id, id, "Id for eth_getBlockByNumber should be equal " + id);
                t.assert(ethNewBlockByNumberResultLatest.result, 'Block should be returned from eth_getBlockByNumber');
                return [3 /*break*/, 5];
            case 4:
                err_7 = _b.sent();
                console.log(err_7);
                t.error(err_7, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_sendTransaction', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, contractAddress, client, id, ethSendTransactionResult, err_8;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, contractAddress = _a.contractAddress, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: contractAddress,
                                from: from,
                                data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
                                gas: '0x0',
                                gasPrice: '0x0',
                                value: '0x0'
                            }
                        ]
                    }))];
            case 3:
                ethSendTransactionResult = _b.sent();
                t.equal(ethSendTransactionResult.id, id, "Id for eth_sendTransaction should be equal " + id);
                t.assert(/0x.+/.test(ethSendTransactionResult.result), 'Hex identification should be returned for eth_sendTransaction command (contract transaction)');
                return [3 /*break*/, 5];
            case 4:
                err_8 = _b.sent();
                console.log(err_8);
                t.error(err_8, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_sendTransaction (deploy)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, client, id, contractDataToDeploy, ethSendTransactionDeployResult, err_9;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                contractDataToDeploy = '0x608060405234801561001057600080fd5b50610189806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c14610071575b600080fd5b61006f600480360381019080803590602001909291905050506100cf565b005b34801561007d57600080fd5b5061008661014e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b806000819055507fc403d054f8d8a57caac9df16a22fc80b97825c521da8eea2943d6d04ba3bab806000543334604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150565b600080600054339150915090915600a165627a7a72305820c6974a05d4e327d57387c8d04a8a5ff056569a4811a69e0de4c15d9ca9135bd70029';
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                from: from,
                                data: contractDataToDeploy,
                                gas: '0x0',
                                gasPrice: '0x0',
                                value: '0x0'
                            }
                        ]
                    }))];
            case 3:
                ethSendTransactionDeployResult = _b.sent();
                t.equal(ethSendTransactionDeployResult.id, id, "Id for eth_sendTransaction should be equal " + id);
                t.assert(/0x.+/.test(ethSendTransactionDeployResult.result), 'Hex identification should be returned for eth_sendTransaction command (deploy new contract)');
                return [3 /*break*/, 5];
            case 4:
                err_9 = _b.sent();
                console.log(err_9);
                t.error(err_9, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_getCode', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, contractAddress, client, id, ethGetCodeResult, err_10;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, contractAddress = _a.contractAddress, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getCode',
                        params: [contractAddress]
                    }))];
            case 3:
                ethGetCodeResult = _b.sent();
                t.equal(ethGetCodeResult.id, id, "Id for eth_getCode should be equal " + id);
                t.assert(/0x.+/.test(ethGetCodeResult.result), 'Hex identification should be returned for eth_getCode command');
                return [3 /*break*/, 5];
            case 4:
                err_10 = _b.sent();
                console.log(err_10);
                t.error(err_10, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_call', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, contractAddress, client, id, ethCallResult, err_11;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, contractAddress = _a.contractAddress, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_call',
                        params: [
                            {
                                to: contractAddress,
                                from: from,
                                data: '0x6d4ce63c'
                            }
                        ]
                    }))];
            case 3:
                ethCallResult = _b.sent();
                t.deepEqual(ethCallResult, {
                    id: id,
                    jsonrpc: '2.0',
                    result: '0x000000000000000000000000000000000000000000000000000000000000000a'
                }, 'Return from eth_call should be 0x000000000000000000000000000000000000000000000000000000000000000a');
                return [3 /*break*/, 5];
            case 4:
                err_11 = _b.sent();
                console.log(err_11);
                t.error(err_11, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_getTransactionReceipt', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, contractAddress, from, id, ethSendTransactionResult, ethGetTransactionReceiptResult, err_12;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client, contractAddress = _a.contractAddress, from = _a.from;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: contractAddress,
                                from: from,
                                data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
                                gas: '0x0',
                                gasPrice: '0x0',
                                value: '0x0'
                            }
                        ]
                    }))];
            case 3:
                ethSendTransactionResult = _b.sent();
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getTransactionReceipt',
                        params: [ethSendTransactionResult.result]
                    }))];
            case 4:
                ethGetTransactionReceiptResult = _b.sent();
                t.equal(ethGetTransactionReceiptResult.result.status, '0x1', 'Status for eth_getTransactionReceipt should be 0x1');
                return [3 /*break*/, 6];
            case 5:
                err_12 = _b.sent();
                console.log(err_12);
                t.error(err_12, 'Error found');
                return [3 /*break*/, 6];
            case 6:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_getTransactionByHash', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, transactionHash, client, id, ethGetTransactionByHashResult, err_13;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, transactionHash = _a.transactionHash, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_getTransactionByHash',
                        params: [transactionHash]
                    }))];
            case 3:
                ethGetTransactionByHashResult = _b.sent();
                t.equal(ethGetTransactionByHashResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethGetTransactionByHashResult.result.hash), 'Hex identification should be returned for eth_getTransactionByHash command');
                return [3 /*break*/, 5];
            case 4:
                err_13 = _b.sent();
                console.log(err_13);
                t.error(err_13, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_subscribe', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, client, id, ethSubscribeResult, err_14;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['logs', { topics: ['0x1'] }]
                    }))];
            case 3:
                ethSubscribeResult = _b.sent();
                t.equal(ethSubscribeResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeResult.result), 'Hex identification should be returned for eth_subscribe command');
                return [3 /*break*/, 5];
            case 4:
                err_14 = _b.sent();
                console.log(err_14);
                t.error(err_14, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider method eth_uninstallFilter', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, client, id, ethUninstallFilter, err_15;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_uninstallFilter',
                        params: ['0x1']
                    }))];
            case 3:
                ethUninstallFilter = _b.sent();
                t.equal(ethUninstallFilter.id, id, "Id for eth_subscribe should be equal " + id);
                t.equal(ethUninstallFilter.result, true, 'Uninstall filter should return true');
                return [3 /*break*/, 5];
            case 4:
                err_15 = _b.sent();
                console.log(err_15);
                t.error(err_15, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider adding custom method', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, client, id, ethBalanceResult, err_16;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                loomProvider.addCustomMethod('eth_balance', function (payload) {
                    t.equal(payload.params[0], from, 'Address should user address');
                    t.equal(payload.method, 'eth_balance', 'Method should be eth_balance');
                    return '0x1';
                });
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_balance',
                        params: [from]
                    }))];
            case 3:
                ethBalanceResult = _b.sent();
                t.equal(ethBalanceResult.result, '0x1', 'Balance should be 0x1');
                return [3 /*break*/, 5];
            case 4:
                err_16 = _b.sent();
                console.log(err_16);
                t.error(err_16, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider overwriting existing method', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, loomProvider, from, client, id, ethEstimateGasResult, err_17;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), loomProvider = _a.loomProvider, from = _a.from, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                id = 1;
                loomProvider.overwriteMethod('eth_estimateGas', function (payload) {
                    t.equal(payload.method, 'eth_estimateGas', 'Method should be eth_estimateGas');
                    return '0x123';
                });
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_estimateGas',
                        params: [from]
                    }))];
            case 3:
                ethEstimateGasResult = _b.sent();
                t.equal(ethEstimateGasResult.result, '0x123', 'Estimate gas should be 0x123');
                return [3 /*break*/, 5];
            case 4:
                err_17 = _b.sent();
                console.log(err_17);
                t.error(err_17, 'Error found');
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('LoomProvider + BlockByNumber transaction issue', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, from, loomProvider, contractData, ABI, result, web3, contract, tx, ethGetBlockByNumberResult, ehtGetBlockByHashResult, err_18;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                client.on('error', function (msg) { return console.error('error', msg); });
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                contractData = '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029';
                ABI = [
                    {
                        constant: false,
                        inputs: [{ name: '_value', type: 'uint256' }],
                        name: 'set',
                        outputs: [],
                        payable: false,
                        stateMutability: 'nonpayable',
                        type: 'function'
                    },
                    {
                        constant: true,
                        inputs: [],
                        name: 'get',
                        outputs: [{ name: '', type: 'uint256' }],
                        payable: false,
                        stateMutability: 'view',
                        type: 'function'
                    },
                    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
                    {
                        anonymous: false,
                        inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
                        name: 'NewValueSet',
                        type: 'event'
                    }
                ];
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                result = _a.sent();
                web3 = new Web3(loomProvider);
                contract = new web3.eth.Contract(ABI, result.contractAddress, { from: from });
                return [4 /*yield*/, contract.methods.set(1).send({ from: from })];
            case 2:
                tx = _a.sent();
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 1000,
                        method: 'eth_getBlockByNumber',
                        params: ["0x" + tx.blockNumber.toString(16)]
                    }))];
            case 3:
                ethGetBlockByNumberResult = _a.sent();
                t.equal(ethGetBlockByNumberResult.result.number, "0x" + tx.blockNumber.toString(16), 'Should block returned by the number match');
                t.assert(ethGetBlockByNumberResult.result.transactions.length > 0, 'Should exists transactions on block');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 1000,
                        method: 'eth_getBlockByHash',
                        params: [tx.blockHash]
                    }))];
            case 4:
                ehtGetBlockByHashResult = _a.sent();
                t.equal(ehtGetBlockByHashResult.result.hash, tx.blockHash, 'Should block returned by the hash match');
                t.assert(ehtGetBlockByHashResult.result.transactions.length > 0, 'Should exists transactions on block');
                // Waiting for newHeads events appear on log
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(5000)];
            case 5:
                // Waiting for newHeads events appear on log
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_18 = _a.sent();
                console.log(err_18);
                return [3 /*break*/, 7];
            case 7:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-tests.js.map