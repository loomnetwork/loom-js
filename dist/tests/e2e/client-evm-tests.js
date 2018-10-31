"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var crypto_utils_1 = require("../../crypto-utils");
tape_1.default('Client EVM test (newBlockEvmFilterAsync)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privateKey, publicKey, filterId, hash, blockList, block, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client = helpers_1.createTestClient();
                client.on('error', function (err) { return t.error(err); });
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(client.newBlockEvmFilterAsync())];
            case 1:
                filterId = _a.sent();
                if (!filterId) {
                    t.fail('Filter Id cannot be null');
                }
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(client.getEvmFilterChangesAsync(filterId))];
            case 2:
                hash = _a.sent();
                if (!hash) {
                    t.fail('Block cannot be null');
                }
                blockList = hash.getEthBlockHashList();
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(client.getEvmBlockByHashAsync(crypto_utils_1.bytesToHexAddr(blockList[0])))];
            case 3:
                block = (_a.sent());
                if (!block) {
                    t.fail('Block cannot be null');
                }
                t.assert(block.getHash(), 'Block should have a hash');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                t.fail(err_1.message);
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
tape_1.default('Client EVM test (newPendingTransactionEvmFilterAsync)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privateKey, publicKey, filterId, hash, err_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client = helpers_1.createTestClient();
                client.on('error', function (err) { return t.error(err); });
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                return [4 /*yield*/, helpers_1.execAndWaitForMillisecondsAsync(client.newPendingTransactionEvmFilterAsync())];
            case 1:
                filterId = _a.sent();
                if (!filterId) {
                    t.fail('Filter Id cannot be null');
                }
                return [4 /*yield*/, client.getEvmFilterChangesAsync(filterId)];
            case 2:
                hash = _a.sent();
                if (!hash) {
                    t.fail('Transaction cannot be null');
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                t.fail(err_2.message);
                return [3 /*break*/, 4];
            case 4:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-evm-tests.js.map