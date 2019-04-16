"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
tape_1.default('LoomProvider + Filters 2', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privKey, loomProvider, ethNewBlockFilter, ethGetFilterChanges, ethGetBlockByHash, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                client.on('error', function (msg) { return console.error('Error on client:', msg); });
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 11,
                        method: 'eth_newBlockFilter'
                    }))];
            case 1:
                ethNewBlockFilter = _a.sent();
                t.assert(/0x.+/.test(ethNewBlockFilter.result), 'New id should be created for new block filter');
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 12,
                        method: 'eth_getFilterChanges',
                        params: [ethNewBlockFilter.result]
                    }))];
            case 2:
                ethGetFilterChanges = _a.sent();
                t.assert(ethGetFilterChanges.result.length > 0, 'Should return filter changes');
                console.log('Hash for the latest block is:', ethGetFilterChanges.result);
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(loomProvider.sendAsync({
                        id: 13,
                        method: 'eth_getBlockByHash',
                        params: [ethGetFilterChanges.result[0], true]
                    }))];
            case 3:
                ethGetBlockByHash = _a.sent();
                t.assert(ethGetBlockByHash.result, 'Should return the block requested by hash');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
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
//# sourceMappingURL=loom-provider-eth-filters-2.js.map