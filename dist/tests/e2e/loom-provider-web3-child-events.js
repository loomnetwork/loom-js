"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var Web3 = require('web3');
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity 0.4.24;
 *
 * interface ContractB {
 *   function callEvent(uint256 v) external;
 * }
 *
 * contract ContractA {
 *   event ContractAEvent(uint256 v);
 *
 *   function doEmit(uint256 _v, address _contractBAddr) public {
 *     emit ContractAEvent(_v);
 *     ContractB(_contractBAddr).callEvent(_v);
 *   }
 * }
 *
 * pragma solidity 0.4.24;
 *
 * contract ContractB {
 *   event ContractBEvent(uint256 v);
 *
 *   function callEvent(uint256 _v) public {
 *     emit ContractBEvent(_v);
 *   }
 * }
 *
 */
function contractABIAndBinary() {
    var contractBData = '6080604052348015600f57600080fd5b5060db8061001e6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063f88d0dfc146044575b600080fd5b348015604f57600080fd5b50606c60048036038101908080359060200190929190505050606e565b005b806000819055507f8611c0f1e10aa104c81817ff1befe6e3677acee7991f16f99a8c375ca0793120816040518082815260200191505060405180910390a1505600a165627a7a723058203819249ad266695de9c923df5f4b3d2b244d3f6ba4297db60b92c4955bec2c230029';
    var contractAData = '608060405234801561001057600080fd5b50610181806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063a045846314610046575b600080fd5b34801561005257600080fd5b5061009160048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610093565b005b7fbb6ecd3f0ef42d655786d77b262f49bee128d78f171832c1ea73b1383674c23a826040518082815260200191505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1663f88d0dfc836040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561013957600080fd5b505af115801561014d573d6000803e3d6000fd5b5050505050505600a165627a7a72305820101762f1d82f0bc7e12cf1b12098f2dfda892ad477dfd98760c2efab436ae3600029';
    var ABIContractB = [
        {
            constant: false,
            inputs: [{ name: '_v', type: 'uint256' }],
            name: 'callEvent',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: 'v', type: 'uint256' }],
            name: 'ContractBEvent',
            type: 'event'
        }
    ];
    var ABIContractA = [
        {
            constant: false,
            inputs: [{ name: '_v', type: 'uint256' }, { name: '_contractBAddr', type: 'address' }],
            name: 'doEmit',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            anonymous: false,
            inputs: [{ indexed: false, name: 'v', type: 'uint256' }],
            name: 'ContractAEvent',
            type: 'event'
        }
    ];
    return { contractBData: contractBData, contractAData: contractAData, ABIContractB: ABIContractB, ABIContractA: ABIContractA };
}
function testContracts(t, contractB, contractA) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var value, tx, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    value = 5;
                    contractA.events.ContractAEvent({}, function (_err, event) {
                        t.equal(event.returnValues.v, '5', 'Value returned should be 5');
                    });
                    contractB.events.ContractBEvent({}, function (_err, event) {
                        t.equal(event.returnValues.v, '5', 'Value returned should be 5');
                    });
                    return [4 /*yield*/, contractA.methods.doEmit(value, contractB.options.address).send()];
                case 1:
                    tx = _a.sent();
                    t.equal(tx.status === '0x1' ? true : tx.status, true, "doEmit should return correct status for " + value);
                    return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deployContractGanache(web3Provider, contractData) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, fromAddr, ethSendTransactionDeployResult, ethGetTransactionReceiptResult;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(web3Provider);
                    fromAddr = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
                    return [4 /*yield*/, web3.eth.sendTransaction({
                            from: fromAddr,
                            data: contractData,
                            gas: '300000',
                            gasPrice: '0x1'
                        })];
                case 1:
                    ethSendTransactionDeployResult = _a.sent();
                    if (!ethSendTransactionDeployResult.status) {
                        throw Error('Cant deploy contract on ganache');
                    }
                    return [4 /*yield*/, web3.eth.getTransactionReceipt(ethSendTransactionDeployResult.transactionHash)];
                case 2:
                    ethGetTransactionReceiptResult = _a.sent();
                    return [2 /*return*/, ethGetTransactionReceiptResult];
            }
        });
    });
}
function testGanache(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var from, websocketProvider, web3, _a, contractBData, contractAData, ABIContractB, ABIContractA, resultB, resultA, contractB, contractA;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    from = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
                    websocketProvider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545');
                    web3 = new Web3(websocketProvider);
                    _a = contractABIAndBinary(), contractBData = _a.contractBData, contractAData = _a.contractAData, ABIContractB = _a.ABIContractB, ABIContractA = _a.ABIContractA;
                    return [4 /*yield*/, deployContractGanache(websocketProvider, contractBData)];
                case 1:
                    resultB = _b.sent();
                    return [4 /*yield*/, deployContractGanache(websocketProvider, contractAData)];
                case 2:
                    resultA = _b.sent();
                    contractB = new web3.eth.Contract(ABIContractB, resultB.contractAddress, { from: from });
                    contractA = new web3.eth.Contract(ABIContractA, resultA.contractAddress, { from: from });
                    t.comment('Testing Ganache');
                    return [4 /*yield*/, testContracts(t, contractB, contractA)];
                case 3:
                    _b.sent();
                    web3.currentProvider.connection.close();
                    return [2 /*return*/];
            }
        });
    });
}
function testLoomProvider(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, client, from, loomProvider, web3, _a, contractBData, contractAData, ABIContractB, ABIContractA, resultB, resultA, contractB, contractA;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    privKey = index_1.CryptoUtils.generatePrivateKey();
                    client = helpers_1.createTestClient();
                    from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                    loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                    web3 = new Web3(loomProvider);
                    _a = contractABIAndBinary(), contractBData = _a.contractBData, contractAData = _a.contractAData, ABIContractB = _a.ABIContractB, ABIContractA = _a.ABIContractA;
                    return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractBData)];
                case 1:
                    resultB = _b.sent();
                    return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractAData)];
                case 2:
                    resultA = _b.sent();
                    contractB = new web3.eth.Contract(ABIContractB, resultB.contractAddress, { from: from });
                    contractA = new web3.eth.Contract(ABIContractA, resultA.contractAddress, { from: from });
                    t.comment('Testing Loom Provider');
                    return [4 /*yield*/, testContracts(t, contractB, contractA)];
                case 3:
                    _b.sent();
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('LoomProvider + Web3 + Child contracts events', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t.plan(6);
                return [4 /*yield*/, testGanache(t)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testLoomProvider(t)];
            case 2:
                _a.sent();
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-web3-child-events.js.map