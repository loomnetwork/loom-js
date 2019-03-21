"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var solidity_helpers_1 = require("../../solidity-helpers");
var ethers_1 = require("ethers");
// TODO: Need a factory to create connection properly likes plasma-cash test
function getEthersConnection() {
    var provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545');
    return provider.getSigner();
}
function getClientAndContract(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, addressMapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = index_1.CryptoUtils.B64ToUint8Array('D6XCGyCcDZ5TE22h66AlU+Bn6JqL4RnSl4a09RGU9LfM53JFG/T5GAnC0uiuIIiw9Dl0TwEAmdGb+WE0Bochkg==');
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
                    ethAddress = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1';
                    from = new index_1.Address('eth', index_1.LocalAddress.fromHexString(ethAddress));
                    to = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                    ethers = getEthersConnection();
                    ethersSigner = new solidity_helpers_1.EthersSigner(ethers);
                    return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, ethersSigner)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, addressMapper.getMappingAsync(from)];
                case 3:
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