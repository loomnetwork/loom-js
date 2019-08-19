"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var contract_1 = require("../contract");
var address_1 = require("../address");
var address_mapper_pb_1 = require("../proto/address_mapper_pb");
var solidity_helpers_1 = require("../solidity-helpers");
var AddressMapper = /** @class */ (function (_super) {
    tslib_1.__extends(AddressMapper, _super);
    function AddressMapper(params) {
        return _super.call(this, params) || this;
    }
    AddressMapper.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('addressmapper')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new AddressMapper({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    AddressMapper.prototype.addIdentityMappingAsync = function (from, to, ethersSigner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mappingIdentityRequest, hash, sign;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mappingIdentityRequest = new address_mapper_pb_1.AddressMapperAddIdentityMappingRequest();
                        mappingIdentityRequest.setFrom(from.MarshalPB());
                        mappingIdentityRequest.setTo(to.MarshalPB());
                        hash = solidity_helpers_1.soliditySha3({
                            type: 'address',
                            value: from.local.toString().slice(2)
                        }, {
                            type: 'address',
                            value: to.local.toString().slice(2)
                        });
                        return [4 /*yield*/, ethersSigner.signAsync(hash)];
                    case 1:
                        sign = _a.sent();
                        mappingIdentityRequest.setSignature(sign);
                        return [2 /*return*/, this.callAsync('AddIdentityMapping', mappingIdentityRequest)];
                }
            });
        });
    };
    /**
     * Similar to addIdentityMappingAsync but for Binance
     */
    AddressMapper.prototype.addBinanceIdentityMappingAsync = function (from, to, ethersSigner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mappingIdentityRequest, msg, sign;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mappingIdentityRequest = new address_mapper_pb_1.AddressMapperAddIdentityMappingRequest();
                        mappingIdentityRequest.setFrom(from.MarshalPB());
                        mappingIdentityRequest.setTo(to.MarshalPB());
                        msg = from.local.toString().slice(2) + to.local.toString().slice(2);
                        return [4 /*yield*/, ethersSigner.signAsync('0x' + msg)];
                    case 1:
                        sign = _a.sent();
                        mappingIdentityRequest.setSignature(sign);
                        return [2 /*return*/, this.callAsync('AddIdentityMapping', mappingIdentityRequest)];
                }
            });
        });
    };
    AddressMapper.prototype.hasMappingAsync = function (from) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hasMappingRequest, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hasMappingRequest = new address_mapper_pb_1.AddressMapperHasMappingRequest();
                        hasMappingRequest.setFrom(from.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('HasMapping', hasMappingRequest, new address_mapper_pb_1.AddressMapperHasMappingResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getHasMapping()];
                }
            });
        });
    };
    AddressMapper.prototype.getMappingAsync = function (from) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getMappingRequest, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getMappingRequest = new address_mapper_pb_1.AddressMapperGetMappingRequest();
                        getMappingRequest.setFrom(from.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('GetMapping', getMappingRequest, new address_mapper_pb_1.AddressMapperGetMappingResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                from: address_1.Address.UnmarshalPB(result.getFrom()),
                                to: address_1.Address.UnmarshalPB(result.getTo())
                            }];
                }
            });
        });
    };
    return AddressMapper;
}(contract_1.Contract));
exports.AddressMapper = AddressMapper;
//# sourceMappingURL=address-mapper.js.map