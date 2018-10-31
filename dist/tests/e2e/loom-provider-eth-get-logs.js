"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
var contractData = '608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029';
function newTransactionToSetState(loomProvider, fromAddr) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var contractDeployResult, contractAddress, ethSendTransactionResult, ethGetTransactionReceiptResult;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
                case 1:
                    contractDeployResult = _a.sent();
                    contractAddress = contractDeployResult.contractAddress;
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 1,
                            method: 'eth_sendTransaction',
                            params: [
                                {
                                    to: contractAddress,
                                    from: fromAddr,
                                    data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000002',
                                    gas: '0x0',
                                    gasPrice: '0x0',
                                    value: '0x0'
                                }
                            ]
                        })
                        // Transaction receipt in order to obtain the topic of the event NewValueSet
                    ];
                case 2:
                    ethSendTransactionResult = _a.sent();
                    return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                            id: 2,
                            method: 'eth_getTransactionReceipt',
                            params: [ethSendTransactionResult.result]
                        }))];
                case 3:
                    ethGetTransactionReceiptResult = _a.sent();
                    return [2 /*return*/, { ethGetTransactionReceiptResult: ethGetTransactionReceiptResult, contractAddress: contractAddress }];
            }
        });
    });
}
function testGetLogsPendingState(t, loomProvider, fromAddr) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var newSetTransaction, ethGetLogs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    newSetTransaction = _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 3,
                            method: 'eth_getLogs',
                            params: [
                                {
                                    address: newSetTransaction.contractAddress,
                                    fromBlock: '0x1',
                                    toBlock: 'pending',
                                    topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
                                }
                            ]
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for the pending block');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsLatest(t, loomProvider, fromAddr) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var newSetTransaction, ethGetLogs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    newSetTransaction = _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 4,
                            method: 'eth_getLogs',
                            params: [
                                {
                                    address: newSetTransaction.contractAddress,
                                    fromBlock: '0x1',
                                    toBlock: 'latest',
                                    topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
                                }
                            ]
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for the latest block');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsAny(t, loomProvider, fromAddr) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var ethGetLogs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 5,
                            method: 'eth_getLogs',
                            params: []
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything filter');
                    return [2 /*return*/];
            }
        });
    });
}
function testGetLogsAnyPending(t, loomProvider, fromAddr) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var ethGetLogs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newTransactionToSetState(loomProvider, fromAddr)
                    // Filtering to get logs
                ];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loomProvider.sendAsync({
                            id: 6,
                            method: 'eth_getLogs',
                            params: [{ toBlock: 'pending' }]
                        })];
                case 2:
                    ethGetLogs = _a.sent();
                    t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything pending filter');
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('LoomProvider.getEVMLogsAsync', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, fromAddr, loomProvider, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                fromAddr = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                return [4 /*yield*/, testGetLogsPendingState(t, loomProvider, fromAddr)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testGetLogsLatest(t, loomProvider, fromAddr)];
            case 2:
                _a.sent();
                return [4 /*yield*/, testGetLogsAny(t, loomProvider, fromAddr)];
            case 3:
                _a.sent();
                return [4 /*yield*/, testGetLogsAnyPending(t, loomProvider, fromAddr)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log(err_1);
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
//# sourceMappingURL=loom-provider-eth-get-logs.js.map