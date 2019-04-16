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
tape_1.default('LoomProvider + Filters', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, loomProvider, ethNewFilterResult, ethNewBlockFilter, ethGetFilterChanges, ethUninstallFilterResult, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)
                    // Transaction receipt in order to obtain the topic of the event NewValueSet
                ];
            case 1:
                _a.sent();
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 10,
                        method: 'eth_newFilter',
                        params: [{ toBlock: 'latest' }]
                    }))];
            case 2:
                ethNewFilterResult = _a.sent();
                t.assert(/0x.+/.test(ethNewFilterResult.result), 'New id should be created for new filter');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 11,
                        method: 'eth_newBlockFilter'
                    }))];
            case 3:
                ethNewBlockFilter = _a.sent();
                t.assert(/0x.+/.test(ethNewBlockFilter.result), 'New id should be created for new block filter');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 12,
                        method: 'eth_getFilterChanges',
                        params: [ethNewBlockFilter.result]
                    }))];
            case 4:
                ethGetFilterChanges = _a.sent();
                t.assert(ethGetFilterChanges.result.length > 0, 'Get filter changes should return array with new blocks');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 13,
                        method: 'eth_uninstallFilter',
                        params: [ethNewBlockFilter.result]
                    }))];
            case 5:
                ethUninstallFilterResult = _a.sent();
                t.deepEqual(ethUninstallFilterResult.result, true, 'Should uninstall filter and return true');
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
//# sourceMappingURL=loom-provider-eth-filters.js.map