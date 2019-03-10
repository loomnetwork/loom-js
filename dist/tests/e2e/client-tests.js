"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var tests_pb_1 = require("../tests_pb");
var client_1 = require("../../client");
var loom_pb_1 = require("../../proto/loom_pb");
var helpers_1 = require("../helpers");
// Tx middleware that will generate a tx with an invalid nonce the first X times it's used.
var InvalidNonceTxMiddleware = /** @class */ (function () {
    function InvalidNonceTxMiddleware(publicKey, client) {
        this.failureCount = 0;
        this.currentAttempt = 0;
        this._mw = new index_1.NonceTxMiddleware(publicKey, client);
    }
    InvalidNonceTxMiddleware.prototype.Handle = function (txData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                if (this.currentAttempt++ < this.failureCount) {
                    tx = new loom_pb_1.NonceTx();
                    tx.setInner(txData);
                    tx.setSequence(0);
                    return [2 /*return*/, tx.serializeBinary()];
                }
                else {
                    return [2 /*return*/, this._mw.Handle(txData)];
                }
                return [2 /*return*/];
            });
        });
    };
    return InvalidNonceTxMiddleware;
}());
tape_1.default('Client nonce retry strategy', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, pubKey, client, nonceMiddlware, contractAddr, callerAddr, contract, msgKey, msgValue, msg, err_1, failed, err_2, err_3;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                client = helpers_1.createTestClient();
                client.on('error', function (err) {
                    console.error('error', err);
                });
                nonceMiddlware = new InvalidNonceTxMiddleware(pubKey, client);
                client.txMiddleware = [nonceMiddlware, new index_1.SignedTxMiddleware(privKey)];
                return [4 /*yield*/, client.getContractAddressAsync('BluePrint')];
            case 1:
                contractAddr = _a.sent();
                if (!contractAddr) {
                    throw new Error('Failed to resolve contract address');
                }
                callerAddr = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                contract = new index_1.Contract({ contractAddr: contractAddr, callerAddr: callerAddr, client: client });
                msgKey = '123';
                msgValue = '456';
                msg = new tests_pb_1.MapEntry();
                msg.setKey(msgKey);
                msg.setValue(msgValue);
                nonceMiddlware.failureCount = 1;
                nonceMiddlware.currentAttempt = 0;
                client.nonceRetryStrategy.retries = 0;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                if (!client_1.isInvalidTxNonceError(err_1)) {
                    throw err_1;
                }
                return [3 /*break*/, 5];
            case 5:
                t.isEqual(nonceMiddlware.currentAttempt, 1, 'Tx should be sent only once when nonceRetryStrategy.retries == 0');
                nonceMiddlware.failureCount = 1;
                nonceMiddlware.currentAttempt = 0;
                client.nonceRetryStrategy.retries = 1;
                return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
            case 6:
                _a.sent();
                t.isEqual(nonceMiddlware.currentAttempt, 2, 'Tx should be sent twice when nonceRetryStrategy.retries == 1');
                nonceMiddlware.failureCount = 2;
                nonceMiddlware.currentAttempt = 0;
                client.nonceRetryStrategy.retries = 1;
                failed = false;
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
            case 8:
                _a.sent();
                return [3 /*break*/, 10];
            case 9:
                err_2 = _a.sent();
                failed = true;
                if (!client_1.isInvalidTxNonceError(err_2)) {
                    throw err_2;
                }
                return [3 /*break*/, 10];
            case 10:
                t.isEqual(nonceMiddlware.currentAttempt, 2, 'Tx should be sent twice when nonceRetryStrategy.retries == 1');
                t.ok(failed, 'Nonce error should be thrown after two failed attempts when nonceRetryStrategy.retries == 1');
                nonceMiddlware.failureCount = 2;
                nonceMiddlware.currentAttempt = 0;
                client.nonceRetryStrategy.retries = 2;
                return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
            case 11:
                _a.sent();
                t.isEqual(nonceMiddlware.currentAttempt, 3, 'Tx should be sent 3 times when nonceRetryStrategy.retries == 2');
                client.disconnect();
                return [3 /*break*/, 13];
            case 12:
                err_3 = _a.sent();
                t.fail(err_3);
                return [3 /*break*/, 13];
            case 13:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-tests.js.map