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
var contractData = '608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029';
tape_1.default('LoomProvider + Subscribe', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, fromAddr, loomProvider, contractDeployResult, id, ethSubscribeNewHardsResult, ethUnsubscribeNewHeadsResult, ethSubscribeLogsResult, ethUnsubscribeLogsResult, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                client.on('error', function (msg) { return console.error('error', msg); });
                fromAddr = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                contractDeployResult = _a.sent();
                id = 1;
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['newHeads', {}]
                    }))];
            case 2:
                ethSubscribeNewHardsResult = _a.sent();
                t.equal(ethSubscribeNewHardsResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeNewHardsResult.result), 'Filter identification should be returned on eth_subscribe');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_unsubscribe',
                        params: [ethSubscribeNewHardsResult.result]
                    }))];
            case 3:
                ethUnsubscribeNewHeadsResult = _a.sent();
                t.equal(ethUnsubscribeNewHeadsResult.id, id, "Id for eth_unsubscribe should be equal " + id);
                t.assert(ethUnsubscribeNewHeadsResult.result, 'Unsubscribed for newHeads');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_subscribe',
                        params: ['logs', {}]
                    }))];
            case 4:
                ethSubscribeLogsResult = _a.sent();
                t.equal(ethSubscribeLogsResult.id, id, "Id for eth_subscribe should be equal " + id);
                t.assert(/0x.+/.test(ethSubscribeLogsResult.result), 'Filter identification should be returned on eth_subscribe');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: id,
                        method: 'eth_unsubscribe',
                        params: [ethSubscribeLogsResult.result]
                    }))];
            case 5:
                ethUnsubscribeLogsResult = _a.sent();
                t.equal(ethUnsubscribeLogsResult.id, id, "Id for eth_unsubscribe should be equal " + id);
                t.assert(ethUnsubscribeLogsResult.result, 'Unsubscribed for Logs');
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
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
tape_1.default('LoomProvider + BlockByNumber transaction issue', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, from, loomProvider, contractData_1, ABI, result, web3, contract, tx, ethGetBlockByNumberResult, ehtGetBlockByHashResult, err_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                client.on('error', function (msg) { return console.error('error', msg); });
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                contractData_1 = '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029';
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
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData_1)];
            case 1:
                result = _a.sent();
                web3 = new Web3(loomProvider);
                contract = new web3.eth.Contract(ABI, result.contractAddress, { from: from });
                return [4 /*yield*/, contract.methods.set(1).send({ from: from })
                    // Subscribe for new heads using eth_subscribe
                ];
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
                err_2 = _a.sent();
                console.log(err_2);
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
//# sourceMappingURL=loom-provider-subscribe.js.map