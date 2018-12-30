"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var dposv2_pb_1 = require("../proto/dposv2_pb");
var big_uint_1 = require("../big-uint");
var DelegationState;
(function (DelegationState) {
    DelegationState[DelegationState["BONDING"] = 0] = "BONDING";
    DelegationState[DelegationState["BONDED"] = 1] = "BONDED";
    DelegationState[DelegationState["UNBONDING"] = 2] = "UNBONDING";
})(DelegationState = exports.DelegationState || (exports.DelegationState = {}));
var DPOS2 = /** @class */ (function (_super) {
    tslib_1.__extends(DPOS2, _super);
    function DPOS2(params) {
        return _super.call(this, params) || this;
    }
    DPOS2.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('dposV2')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new DPOS2({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    DPOS2.prototype.getCandidatesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listCandidatesReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listCandidatesReq = new dposv2_pb_1.ListCandidateRequestV2();
                        return [4 /*yield*/, this.staticCallAsync('ListCandidates', listCandidatesReq, new dposv2_pb_1.ListCandidateResponseV2())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getCandidatesList().map(function (candidate) { return ({
                                pubKey: candidate.getPubKey_asU8(),
                                address: address_1.Address.UmarshalPB(candidate.getAddress()),
                                fee: new bn_js_1.default(candidate.getFee()),
                                name: candidate.getName(),
                                description: candidate.getDescription(),
                                website: candidate.getWebsite()
                            }); })];
                }
            });
        });
    };
    DPOS2.prototype.getValidatorsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listValidatorReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listValidatorReq = new dposv2_pb_1.ListValidatorsRequestV2();
                        return [4 /*yield*/, this.staticCallAsync('ListValidators', listValidatorReq, new dposv2_pb_1.ListValidatorsResponseV2())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getStatisticsList().map(function (validator) { return ({
                                address: address_1.Address.UmarshalPB(validator.getAddress()),
                                pubKey: validator.getPubKey_asU8(),
                                upblockCount: validator.getUpblockCount(),
                                blockCount: validator.getBlockCount(),
                                slashPct: validator.getSlashPercentage() ? big_uint_1.unmarshalBigUIntPB(validator.getSlashPercentage()) : new bn_js_1.default(0),
                                distributionTotal: validator.getDistributionTotal() ? big_uint_1.unmarshalBigUIntPB(validator.getDistributionTotal()) : new bn_js_1.default(0),
                                delegationTotal: validator.getDelegationTotal() ? big_uint_1.unmarshalBigUIntPB(validator.getDelegationTotal()) : new bn_js_1.default(0)
                            }); })];
                }
            });
        });
    };
    DPOS2.prototype.checkDelegationAsync = function (validator, delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkDelegationReq, result, delegation;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkDelegationReq = new dposv2_pb_1.CheckDelegationRequestV2();
                        checkDelegationReq.setValidatorAddress(validator.MarshalPB());
                        checkDelegationReq.setDelegatorAddress(delegator.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('CheckDelegation', checkDelegationReq, new dposv2_pb_1.CheckDelegationResponseV2())];
                    case 1:
                        result = _a.sent();
                        delegation = result.getDelegation();
                        return [2 /*return*/, delegation
                                ? {
                                    validator: address_1.Address.UmarshalPB(delegation.getValidator()),
                                    delegator: address_1.Address.UmarshalPB(delegation.getDelegator()),
                                    amount: delegation.getAmount() ? big_uint_1.unmarshalBigUIntPB(delegation.getAmount()) : new bn_js_1.default(0),
                                    updateAmount: delegation.getUpdateAmount() ? big_uint_1.unmarshalBigUIntPB(delegation.getAmount()) : new bn_js_1.default(0),
                                    height: new bn_js_1.default(delegation.getHeight()),
                                    lockTime: delegation.getLockTime(),
                                    state: delegation.getState()
                                }
                                : null];
                }
            });
        });
    };
    DPOS2.prototype.claimDistributionAsync = function (withdrawalAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var claimDistributionRequest;
            return tslib_1.__generator(this, function (_a) {
                claimDistributionRequest = new dposv2_pb_1.ClaimDistributionRequestV2();
                claimDistributionRequest.setWithdrawalAddress(withdrawalAddress.MarshalPB());
                return [2 /*return*/, this.callAsync('ClaimDistribution', claimDistributionRequest)];
            });
        });
    };
    DPOS2.prototype.registerCandidateAsync = function (pubKey, fee, name, description, website) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var registerCandidateRequest;
            return tslib_1.__generator(this, function (_a) {
                registerCandidateRequest = new dposv2_pb_1.RegisterCandidateRequestV2();
                registerCandidateRequest.setPubKey(pubKey);
                registerCandidateRequest.setFee(fee.toString(10));
                registerCandidateRequest.setName(name);
                registerCandidateRequest.setDescription(description);
                registerCandidateRequest.setWebsite(website);
                return [2 /*return*/, this.callAsync('RegisterCandidate', registerCandidateRequest)];
            });
        });
    };
    DPOS2.prototype.unregisterCandidateAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unregisterCandidateRequest;
            return tslib_1.__generator(this, function (_a) {
                unregisterCandidateRequest = new dposv2_pb_1.UnregisterCandidateRequestV2();
                return [2 /*return*/, this.callAsync('UnregisterCandidate', unregisterCandidateRequest)];
            });
        });
    };
    DPOS2.prototype.delegateAsync = function (validator, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var delegateRequest;
            return tslib_1.__generator(this, function (_a) {
                delegateRequest = new dposv2_pb_1.DelegateRequestV2();
                delegateRequest.setValidatorAddress(validator.MarshalPB());
                delegateRequest.setAmount(big_uint_1.marshalBigUIntPB(amount));
                return [2 /*return*/, this.callAsync('Delegate', delegateRequest)];
            });
        });
    };
    DPOS2.prototype.unbondAsync = function (validator, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unbondRequest;
            return tslib_1.__generator(this, function (_a) {
                unbondRequest = new dposv2_pb_1.UnbondRequestV2();
                unbondRequest.setValidatorAddress(validator.MarshalPB());
                unbondRequest.setAmount(big_uint_1.marshalBigUIntPB(new bn_js_1.default(amount)));
                return [2 /*return*/, this.callAsync('Unbond', unbondRequest)];
            });
        });
    };
    // Test spam Elections:
    DPOS2.prototype.electAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unbondRequest;
            return tslib_1.__generator(this, function (_a) {
                unbondRequest = new dposv2_pb_1.UnbondRequestV2();
                return [2 /*return*/, this.callAsync('Elect', unbondRequest)];
            });
        });
    };
    return DPOS2;
}(contract_1.Contract));
exports.DPOS2 = DPOS2;
//# sourceMappingURL=dpos2.js.map