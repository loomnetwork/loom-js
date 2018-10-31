"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var crypto_utils_1 = require("../../crypto-utils");
function getClientAndContract(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, dpos;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = crypto_utils_1.B64ToUint8Array('Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ==');
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient();
                    client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                    return [4 /*yield*/, index_1.Contracts.DPOS.createAsync(client, new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey)))];
                case 1:
                    dpos = _a.sent();
                    return [2 /*return*/, { client: client, dpos: dpos, pubKey: pubKey }];
            }
        });
    });
}
function registerCandidate(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    return [4 /*yield*/, dpos.registerCandidateAsync(pubKey)];
                case 2:
                    _b.sent();
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function unregisterCandidate(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos;
                    return [4 /*yield*/, dpos.unregisterCandidateAsync()];
                case 2:
                    _b.sent();
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function voteRequest(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey, candidate;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    candidate = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                    return [4 /*yield*/, dpos.voteAsync(candidate, 100)];
                case 2:
                    _b.sent();
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function electionRequest(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    return [4 /*yield*/, dpos.electAsync()];
                case 2:
                    _b.sent();
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function listCandidates(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey, candidates;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    return [4 /*yield*/, dpos.getCandidatesAsync()];
                case 2:
                    candidates = _b.sent();
                    t.assert(candidates.length === 1, 'Should have one candidate');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function listWitness(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey, witnesses;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    return [4 /*yield*/, dpos.getWitnessesAsync()];
                case 2:
                    witnesses = _b.sent();
                    t.assert(witnesses.length === 1, 'Should have one witness');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('DPOS', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                return [4 /*yield*/, registerCandidate(t, helpers_1.createTestHttpClient)];
            case 1:
                _a.sent();
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 2:
                _a.sent();
                return [4 /*yield*/, voteRequest(t, helpers_1.createTestHttpClient)];
            case 3:
                _a.sent();
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 4:
                _a.sent();
                return [4 /*yield*/, electionRequest(t, helpers_1.createTestHttpClient)];
            case 5:
                _a.sent();
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 6:
                _a.sent();
                return [4 /*yield*/, listCandidates(t, helpers_1.createTestHttpClient)];
            case 7:
                _a.sent();
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 8:
                _a.sent();
                return [4 /*yield*/, unregisterCandidate(t, helpers_1.createTestHttpClient)];
            case 9:
                _a.sent();
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 10:
                _a.sent();
                return [4 /*yield*/, listWitness(t, helpers_1.createTestHttpClient)];
            case 11:
                _a.sent();
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 13];
            case 13:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=dpos-tests.js.map