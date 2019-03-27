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
    DelegationState[DelegationState["REDELEGATING"] = 3] = "REDELEGATING";
})(DelegationState = exports.DelegationState || (exports.DelegationState = {}));
var LockTimeTier;
(function (LockTimeTier) {
    LockTimeTier[LockTimeTier["Tier0"] = 0] = "Tier0";
    LockTimeTier[LockTimeTier["Tier1"] = 1] = "Tier1";
    LockTimeTier[LockTimeTier["Tier2"] = 2] = "Tier2";
    LockTimeTier[LockTimeTier["Tier3"] = 3] = "Tier3";
})(LockTimeTier = exports.LockTimeTier || (exports.LockTimeTier = {}));
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
    DPOS2.prototype.getTimeUntilElectionAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeUntilElectionRequest, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeUntilElectionRequest = new dposv2_pb_1.TimeUntilElectionRequest();
                        return [4 /*yield*/, this.staticCallAsync('TimeUntilElection', timeUntilElectionRequest, new dposv2_pb_1.TimeUntilElectionResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(result.getTimeUntilElection())];
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
                                address: address_1.Address.UnmarshalPB(candidate.getAddress()),
                                fee: new bn_js_1.default(candidate.getFee()),
                                newFee: new bn_js_1.default(candidate.getNewfee()),
                                feeDelayCounter: new bn_js_1.default(candidate.getFeedelaycounter()),
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
                                address: address_1.Address.UnmarshalPB(validator.getAddress()),
                                pubKey: validator.getPubKey_asU8(),
                                upblockCount: validator.getUpblockCount(),
                                blockCount: validator.getBlockCount(),
                                whitelistAmount: validator.getWhitelistAmount()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getWhitelistAmount())
                                    : new bn_js_1.default(0),
                                whitelistLockTime: new bn_js_1.default(validator.getWhitelistLocktime()),
                                slashPct: validator.getSlashPercentage()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getSlashPercentage())
                                    : new bn_js_1.default(0),
                                distributionTotal: validator.getDistributionTotal()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getDistributionTotal())
                                    : new bn_js_1.default(0),
                                delegationTotal: validator.getDelegationTotal()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getDelegationTotal())
                                    : new bn_js_1.default(0)
                            }); })];
                }
            });
        });
    };
    DPOS2.prototype.getDelegations = function (candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listDelegationsReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listDelegationsReq = new dposv2_pb_1.ListDelegationsRequest();
                        listDelegationsReq.setCandidate(candidate.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('ListDelegations', listDelegationsReq, new dposv2_pb_1.ListDelegationsResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                delegationTotal: result.getDelegationTotal()
                                    ? big_uint_1.unmarshalBigUIntPB(result.getDelegationTotal())
                                    : new bn_js_1.default(0),
                                delegationsArray: result.getDelegationsList().map(this.getDelegation)
                            }];
                }
            });
        });
    };
    DPOS2.prototype.getAllDelegations = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listAllDelegationsReq, result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listAllDelegationsReq = new dposv2_pb_1.ListAllDelegationsRequest();
                        return [4 /*yield*/, this.staticCallAsync('ListAllDelegations', listAllDelegationsReq, new dposv2_pb_1.ListAllDelegationsResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getListresponsesList().map(function (d) {
                                return {
                                    delegationTotal: d.getDelegationTotal()
                                        ? big_uint_1.unmarshalBigUIntPB(d.getDelegationTotal())
                                        : new bn_js_1.default(0),
                                    delegationsArray: d.getDelegationsList().map(_this.getDelegation)
                                };
                            })];
                }
            });
        });
    };
    DPOS2.prototype.checkDelegatorDelegations = function (delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkDelegatorDelegationsReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkDelegatorDelegationsReq = new dposv2_pb_1.CheckAllDelegationsRequest();
                        checkDelegatorDelegationsReq.setDelegatorAddress(delegator.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('CheckAllDelegations', checkDelegatorDelegationsReq, new dposv2_pb_1.CheckAllDelegationsResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                amount: result.getAmount() ? big_uint_1.unmarshalBigUIntPB(result.getAmount()) : new bn_js_1.default(0),
                                weightedAmount: result.getWeightedAmount()
                                    ? big_uint_1.unmarshalBigUIntPB(result.getWeightedAmount())
                                    : new bn_js_1.default(0),
                                delegationsArray: result.getDelegationsList().map(this.getDelegation)
                            }];
                }
            });
        });
    };
    DPOS2.prototype.checkDistributionAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkDistributionReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkDistributionReq = new dposv2_pb_1.CheckDistributionRequest();
                        checkDistributionReq.setAddress(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('CheckDistribution', checkDistributionReq, new dposv2_pb_1.CheckDistributionResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getAmount() ? big_uint_1.unmarshalBigUIntPB(result.getAmount()) : new bn_js_1.default(0)];
                }
            });
        });
    };
    DPOS2.prototype.totalDelegationAsync = function (delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var totalDelegationReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        totalDelegationReq = new dposv2_pb_1.TotalDelegationRequest();
                        totalDelegationReq.setDelegatorAddress(delegator.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('TotalDelegation', totalDelegationReq, new dposv2_pb_1.TotalDelegationResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                amount: result.getAmount() ? big_uint_1.unmarshalBigUIntPB(result.getAmount()) : new bn_js_1.default(0),
                                weightedAmount: result.getWeightedAmount()
                                    ? big_uint_1.unmarshalBigUIntPB(result.getWeightedAmount())
                                    : new bn_js_1.default(0)
                            }];
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
                        return [2 /*return*/, delegation ? this.getDelegation(delegation) : null];
                }
            });
        });
    };
    DPOS2.prototype.claimDistributionAsync = function (withdrawalAddress) {
        var claimDistributionRequest = new dposv2_pb_1.ClaimDistributionRequestV2();
        claimDistributionRequest.setWithdrawalAddress(withdrawalAddress.MarshalPB());
        return this.callAsync('ClaimDistribution', claimDistributionRequest);
    };
    DPOS2.prototype.registerCandidateAsync = function (pubKey, fee, name, description, website, tier) {
        var registerCandidateRequest = new dposv2_pb_1.RegisterCandidateRequestV2();
        registerCandidateRequest.setPubKey(pubKey);
        registerCandidateRequest.setFee(fee.toString(10));
        registerCandidateRequest.setName(name);
        registerCandidateRequest.setDescription(description);
        registerCandidateRequest.setWebsite(website);
        registerCandidateRequest.setLocktimeTier(tier);
        return this.callAsync('RegisterCandidate', registerCandidateRequest);
    };
    DPOS2.prototype.unregisterCandidateAsync = function () {
        var unregisterCandidateRequest = new dposv2_pb_1.UnregisterCandidateRequestV2();
        return this.callAsync('UnregisterCandidate', unregisterCandidateRequest);
    };
    DPOS2.prototype.delegateAsync = function (validator, amount, tier, referrer) {
        var delegateRequest = new dposv2_pb_1.DelegateRequestV2();
        delegateRequest.setValidatorAddress(validator.MarshalPB());
        delegateRequest.setAmount(big_uint_1.marshalBigUIntPB(amount));
        delegateRequest.setLocktimeTier(tier);
        if (referrer) {
            delegateRequest.setReferrer(referrer);
        }
        return this.callAsync('Delegate2', delegateRequest);
    };
    DPOS2.prototype.redelegateAsync = function (oldValidator, validator, amount, referrer) {
        var redelegateRequest = new dposv2_pb_1.RedelegateRequestV2();
        redelegateRequest.setFormerValidatorAddress(oldValidator.MarshalPB());
        redelegateRequest.setValidatorAddress(validator.MarshalPB());
        redelegateRequest.setAmount(big_uint_1.marshalBigUIntPB(amount));
        if (referrer) {
            redelegateRequest.setReferrer(referrer);
        }
        return this.callAsync('Redelegate', redelegateRequest);
    };
    DPOS2.prototype.unbondAsync = function (validator, amount) {
        var unbondRequest = new dposv2_pb_1.UnbondRequestV2();
        unbondRequest.setValidatorAddress(validator.MarshalPB());
        unbondRequest.setAmount(big_uint_1.marshalBigUIntPB(new bn_js_1.default(amount)));
        return this.callAsync('Unbond', unbondRequest);
    };
    DPOS2.prototype.getDelegation = function (delegation) {
        return {
            validator: address_1.Address.UnmarshalPB(delegation.getValidator()),
            updateValidator: delegation.getUpdateValidator()
                ? address_1.Address.UnmarshalPB(delegation.getUpdateValidator())
                : undefined,
            delegator: address_1.Address.UnmarshalPB(delegation.getDelegator()),
            amount: delegation.getAmount() ? big_uint_1.unmarshalBigUIntPB(delegation.getAmount()) : new bn_js_1.default(0),
            updateAmount: delegation.getUpdateAmount()
                ? big_uint_1.unmarshalBigUIntPB(delegation.getUpdateAmount())
                : new bn_js_1.default(0),
            height: new bn_js_1.default(delegation.getHeight()),
            lockTime: delegation.getLockTime(),
            lockTimeTier: delegation.getLocktimeTier(),
            state: delegation.getState()
        };
    };
    return DPOS2;
}(contract_1.Contract));
exports.DPOS2 = DPOS2;
//# sourceMappingURL=dpos2.js.map