"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var crypto_utils_1 = require("../../crypto-utils");
var dpos2_1 = require("../../contracts/dpos2");
var toCoinE18 = function (amount) {
    return new bn_js_1.default(10).pow(new bn_js_1.default(18)).mul(new bn_js_1.default(amount));
};
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
                    return [4 /*yield*/, index_1.Contracts.DPOS2.createAsync(client, new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey)))];
                case 1:
                    dpos = _a.sent();
                    return [2 /*return*/, { client: client, dpos: dpos, pubKey: pubKey }];
            }
        });
    });
}
function registerCandidate(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, dpos, pubKey, pub;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, dpos = _a.dpos, pubKey = _a.pubKey;
                    pub = index_1.LocalAddress.fromPublicKey(pubKey).toString();
                    return [4 /*yield*/, dpos.registerCandidateAsync(pub, toCoinE18(1), 'juca', 'som', 'http://www.com.br', dpos2_1.LockTimeTier.Tier0)];
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
// async function voteRequest(t: test.Test, createClient: () => Client) {
//   const { client, dpos, pubKey } = await getClientAndContract(createClient)
//   const candidate = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
//   // await dpos.dele
//   client.disconnect()
// }
// async function electionRequest(t: test.Test, createClient: () => Client) {
//   const { client, dpos, pubKey } = await getClientAndContract(createClient)
//   await dpos.electAsync()
//   client.disconnect()
// }
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
// async function listWitness(t: test.Test, createClient: () => Client) {
//   const { client, dpos, pubKey } = await getClientAndContract(createClient)
//   const witnesses = await dpos.getAl
//   t.assert(witnesses!.length === 1, 'Should have one witness')
//   client.disconnect()
// }
tape_1.default('DPOS', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, registerCandidate(t, helpers_1.createTestHttpClient)
                    // await waitForMillisecondsAsync(1000)
                    // // await voteRequest(t, createTestHttpClient)
                    // await waitForMillisecondsAsync(1000)
                    // // await electionRequest(t, createTestHttpClient)
                    // await waitForMillisecondsAsync(1000)
                    // await listCandidates(t, createTestHttpClient)
                    // await waitForMillisecondsAsync(1000)
                    // await unregisterCandidate(t, createTestHttpClient)
                    // await waitForMillisecondsAsync(1000)
                    // await listWitness(t, createTestHttpClient)
                ];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 3];
            case 3:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=dpos-tests.js.map