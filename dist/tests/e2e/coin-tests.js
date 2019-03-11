"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var crypto_utils_1 = require("../../crypto-utils");
var toCoinE18 = function (amount) {
    return new bn_js_1.default(10).pow(new bn_js_1.default(18)).mul(new bn_js_1.default(amount));
};
function getClientAndContract(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var acct1PrivKey, acct2PrivKey, acct1PubKey, acct2PubKey, acct1Client, acct2Client, acct1Coin, acct2Coin;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acct1PrivKey = crypto_utils_1.B64ToUint8Array('Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ==');
                    acct2PrivKey = crypto_utils_1.B64ToUint8Array('3bpboaOX/8R2XPS6q6SmhGq+RBvs+3DDkWXayy58lIC+9k1Sj1K0BEQb82OcLZ8Ivkh9EL5/hWgXLKu3vNLc/g==');
                    acct1PubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(acct1PrivKey);
                    acct2PubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(acct2PrivKey);
                    acct1Client = createClient();
                    acct2Client = createClient();
                    acct1Client.txMiddleware = index_1.createDefaultTxMiddleware(acct1Client, acct1PrivKey);
                    acct2Client.txMiddleware = index_1.createDefaultTxMiddleware(acct2Client, acct2PrivKey);
                    return [4 /*yield*/, index_1.Contracts.Coin.createAsync(acct1Client, new index_1.Address(acct1Client.chainId, index_1.LocalAddress.fromPublicKey(acct1PubKey)))];
                case 1:
                    acct1Coin = _a.sent();
                    return [4 /*yield*/, index_1.Contracts.Coin.createAsync(acct2Client, new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey)))];
                case 2:
                    acct2Coin = _a.sent();
                    return [2 /*return*/, { acct1Client: acct1Client, acct1Coin: acct1Coin, acct1PubKey: acct1PubKey, acct2Client: acct2Client, acct2Coin: acct2Coin, acct2PubKey: acct2PubKey }];
            }
        });
    });
}
function testTotalSupply(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, totalSupply;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin;
                    return [4 /*yield*/, acct1Coin.getTotalSupplyAsync()];
                case 2:
                    totalSupply = _b.sent();
                    t.assert(totalSupply.eq(toCoinE18(100)), 'Total Supply should be 100e18');
                    acct1Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testBalanceOf(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, acct1PubKey, acct2Client, acct2Coin, acct2PubKey, acct1Owner, acct1Balance, acct2Owner, acct2Balance;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin, acct1PubKey = _a.acct1PubKey, acct2Client = _a.acct2Client, acct2Coin = _a.acct2Coin, acct2PubKey = _a.acct2PubKey;
                    acct1Owner = new index_1.Address(acct1Client.chainId, index_1.LocalAddress.fromPublicKey(acct1PubKey));
                    return [4 /*yield*/, acct1Coin.getBalanceOfAsync(acct1Owner)];
                case 2:
                    acct1Balance = _b.sent();
                    t.assert(acct1Balance.eq(toCoinE18(100)), 'Acct 1 balance should be 100e18');
                    acct2Owner = new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey));
                    return [4 /*yield*/, acct2Coin.getBalanceOfAsync(acct2Owner)];
                case 3:
                    acct2Balance = _b.sent();
                    t.assert(acct2Balance.eq(toCoinE18(0)), 'Acct 2 balance should be 0');
                    acct1Client.disconnect();
                    acct2Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testTransfer(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, acct1PubKey, acct2Client, acct2Coin, acct2PubKey, from, to, acct1Balance, acct2Balance;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin, acct1PubKey = _a.acct1PubKey, acct2Client = _a.acct2Client, acct2Coin = _a.acct2Coin, acct2PubKey = _a.acct2PubKey;
                    from = new index_1.Address(acct1Client.chainId, index_1.LocalAddress.fromPublicKey(acct1PubKey));
                    to = new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey));
                    return [4 /*yield*/, acct1Coin.transferAsync(to, toCoinE18(10))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, acct1Coin.getBalanceOfAsync(from)];
                case 3:
                    acct1Balance = _b.sent();
                    t.assert(acct1Balance.eq(toCoinE18(90)), 'Acct 1 Balance after transfer should be 90e18');
                    return [4 /*yield*/, acct2Coin.getBalanceOfAsync(to)];
                case 4:
                    acct2Balance = _b.sent();
                    t.assert(acct2Balance.eq(toCoinE18(10)), 'Acct 2 Balance after transfer should be 10e18');
                    acct1Client.disconnect();
                    acct2Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testApprove(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, acct2Client, acct2PubKey, spender;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin, acct2Client = _a.acct2Client, acct2PubKey = _a.acct2PubKey;
                    spender = new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey));
                    return [4 /*yield*/, acct1Coin.approveAsync(spender, toCoinE18(1))];
                case 2:
                    _b.sent();
                    acct1Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testAllowance(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, acct1PubKey, acct2Client, acct2PubKey, spender, owner, allowance;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin, acct1PubKey = _a.acct1PubKey, acct2Client = _a.acct2Client, acct2PubKey = _a.acct2PubKey;
                    spender = new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey));
                    owner = new index_1.Address(acct1Client.chainId, index_1.LocalAddress.fromPublicKey(acct1PubKey));
                    return [4 /*yield*/, acct1Coin.getAllowanceAsync(owner, spender)];
                case 2:
                    allowance = _b.sent();
                    t.assert(allowance.eq(toCoinE18(1)), 'Allowance should be 1');
                    acct1Client.disconnect();
                    acct2Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testTransferFrom(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, acct1Client, acct1Coin, acct1PubKey, acct2Client, acct2Coin, acct2PubKey, spender, owner, acct1Balance, acct2Balance;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), acct1Client = _a.acct1Client, acct1Coin = _a.acct1Coin, acct1PubKey = _a.acct1PubKey, acct2Client = _a.acct2Client, acct2Coin = _a.acct2Coin, acct2PubKey = _a.acct2PubKey;
                    spender = new index_1.Address(acct2Client.chainId, index_1.LocalAddress.fromPublicKey(acct2PubKey));
                    owner = new index_1.Address(acct1Client.chainId, index_1.LocalAddress.fromPublicKey(acct1PubKey));
                    return [4 /*yield*/, acct2Coin.transferFromAsync(owner, spender, toCoinE18(1))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, acct1Coin.getBalanceOfAsync(owner)];
                case 3:
                    acct1Balance = _b.sent();
                    t.assert(acct1Balance.eq(toCoinE18(89)), 'Acct 1 Balance after transfer should be 89e18');
                    return [4 /*yield*/, acct2Coin.getBalanceOfAsync(spender)];
                case 4:
                    acct2Balance = _b.sent();
                    t.assert(acct2Balance.eq(toCoinE18(11)), 'Acct 2 Balance after transfer should be 11e18');
                    acct1Client.disconnect();
                    acct2Client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('Coin', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, testTotalSupply(t, helpers_1.createTestHttpClient)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testBalanceOf(t, helpers_1.createTestHttpClient)];
            case 2:
                _a.sent();
                return [4 /*yield*/, testTransfer(t, helpers_1.createTestHttpClient)];
            case 3:
                _a.sent();
                return [4 /*yield*/, testApprove(t, helpers_1.createTestHttpClient)];
            case 4:
                _a.sent();
                return [4 /*yield*/, testAllowance(t, helpers_1.createTestHttpClient)];
            case 5:
                _a.sent();
                return [4 /*yield*/, testTransferFrom(t, helpers_1.createTestHttpClient)];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 8];
            case 8:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=coin-tests.js.map