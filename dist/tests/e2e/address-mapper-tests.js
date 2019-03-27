"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var solidity_helpers_1 = require("../../solidity-helpers");
function getClientAndContract(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, addressMapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = index_1.CryptoUtils.B64ToUint8Array('RkNvOsko0nQFrJnXXVbmjGyaVmjQyr+ecJG8qGiF1LisazmV44qDcpsVsYvQZ9jxx7mIWJuZumIzYyLL6FOb4A==');
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient();
                    client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                    return [4 /*yield*/, index_1.Contracts.AddressMapper.createAsync(client, new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey)))];
                case 1:
                    addressMapper = _a.sent();
                    return [2 /*return*/, { client: client, addressMapper: addressMapper, pubKey: pubKey }];
            }
        });
    });
}
function testAddIdentity(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, addressMapper, pubKey, ethAddress, from, to, ethers, ethersSigner, result;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, addressMapper = _a.addressMapper, pubKey = _a.pubKey;
                    ethAddress = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0';
                    from = new index_1.Address('eth', index_1.LocalAddress.fromHexString(ethAddress));
                    to = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                    return [4 /*yield*/, solidity_helpers_1.getJsonRPCSignerAsync('http://localhost:8545', 1)];
                case 2:
                    ethers = _b.sent();
                    ethersSigner = new solidity_helpers_1.EthersSigner(ethers);
                    return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, ethersSigner)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, addressMapper.getMappingAsync(from)];
                case 4:
                    result = _b.sent();
                    t.assert(from.equals(result.from), 'Identity "from" correctly returned');
                    t.assert(to.equals(result.to), 'Identity "to" correctly returned');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('Address Mapper', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, testAddIdentity(t, helpers_1.createTestHttpClient)];
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
//# sourceMappingURL=address-mapper-tests.js.map