"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var dposv3_pb_1 = require("../proto/dposv3_pb");
var big_uint_1 = require("../big-uint");
var DPOS3 = /** @class */ (function (_super) {
    tslib_1.__extends(DPOS3, _super);
    function DPOS3(params) {
        return _super.call(this, params) || this;
    }
    DPOS3.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('dposV3')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new DPOS3({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    DPOS3.prototype.getTimeUntilElectionAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var timeUntilElectionRequest, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeUntilElectionRequest = new dposv3_pb_1.TimeUntilElectionRequestV3();
                        return [4 /*yield*/, this.staticCallAsync('TimeUntilElection', timeUntilElectionRequest, new dposv3_pb_1.TimeUntilElectionResponseV3())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(result.getTimeUntilElection())];
                }
            });
        });
    };
    DPOS3.prototype.getCandidatesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listCandidatesReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listCandidatesReq = new dposv3_pb_1.ListCandidatesRequest();
                        return [4 /*yield*/, this.staticCallAsync('ListCandidates', listCandidatesReq, new dposv3_pb_1.ListCandidatesResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getCandidatesList().map(function (candidate) { return ({
                                address: address_1.Address.UnmarshalPB(candidate.getCandidate().getAddress()),
                                pubKey: candidate.getCandidate().getPubKey_asU8(),
                                delegationTotal: big_uint_1.unmarshalBigUIntPB(candidate.getStatistic().getDelegationTotal()),
                                slashPct: candidate.getStatistic().getSlashPercentage() ?
                                    big_uint_1.unmarshalBigUIntPB(candidate.getStatistic().getSlashPercentage()) :
                                    new bn_js_1.default(0),
                                whitelistAmount: big_uint_1.unmarshalBigUIntPB(candidate.getStatistic().getWhitelistAmount()),
                                whitelistLocktimeTier: candidate.getStatistic().getLocktimeTier(),
                                maxReferralPercentage: candidate.getCandidate().getMaxReferralPercentage(),
                                fee: new bn_js_1.default(candidate.getCandidate().getFee()),
                                newFee: new bn_js_1.default(candidate.getCandidate().getNewFee()),
                                candidateState: candidate.getCandidate().getState(),
                                name: candidate.getCandidate().getName(),
                                description: candidate.getCandidate().getDescription(),
                                website: candidate.getCandidate().getWebsite()
                            }); })];
                }
            });
        });
    };
    DPOS3.prototype.getValidatorsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listValidatorReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listValidatorReq = new dposv3_pb_1.ListValidatorsRequest();
                        return [4 /*yield*/, this.staticCallAsync('ListValidators', listValidatorReq, new dposv3_pb_1.ListValidatorsResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getStatisticsList().map(function (validator) { return ({
                                address: address_1.Address.UnmarshalPB(validator.getAddress()),
                                pubKey: validator.getPubKey_asU8(),
                                whitelistAmount: validator.getWhitelistAmount()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getWhitelistAmount())
                                    : new bn_js_1.default(0),
                                whitelistLocktimeTier: validator.getLocktimeTier(),
                                slashPct: validator.getSlashPercentage()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getSlashPercentage())
                                    : new bn_js_1.default(0),
                                delegationTotal: validator.getDelegationTotal()
                                    ? big_uint_1.unmarshalBigUIntPB(validator.getDelegationTotal())
                                    : new bn_js_1.default(0)
                            }); })];
                }
            });
        });
    };
    DPOS3.prototype.getDelegations = function (candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listDelegationsReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listDelegationsReq = new dposv3_pb_1.ListDelegationsRequestV3();
                        listDelegationsReq.setCandidate(candidate.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('ListDelegations', listDelegationsReq, new dposv3_pb_1.ListDelegationsResponseV3())];
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
    DPOS3.prototype.getAllDelegations = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listAllDelegationsReq, result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listAllDelegationsReq = new dposv3_pb_1.ListAllDelegationsRequestV3();
                        return [4 /*yield*/, this.staticCallAsync('ListAllDelegations', listAllDelegationsReq, new dposv3_pb_1.ListAllDelegationsResponseV3())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getListResponsesList().map(function (d) {
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
    // gets all the delegations by a delegator
    DPOS3.prototype.checkAllDelegationsAsync = function (delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkDelegatorDelegationsReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkDelegatorDelegationsReq = new dposv3_pb_1.CheckAllDelegationsRequestV3();
                        checkDelegatorDelegationsReq.setDelegatorAddress(delegator.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('CheckAllDelegations', checkDelegatorDelegationsReq, new dposv3_pb_1.CheckAllDelegationsResponseV3())];
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
    // get all the delegations by a delegator to a specific validator
    DPOS3.prototype.checkDelegationAsync = function (validator, delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var checkDelegationReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkDelegationReq = new dposv3_pb_1.CheckDelegationRequest();
                        checkDelegationReq.setValidatorAddress(validator.MarshalPB());
                        checkDelegationReq.setDelegatorAddress(delegator.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('CheckDelegation', checkDelegationReq, new dposv3_pb_1.CheckDelegationResponse())];
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
    DPOS3.prototype.registerCandidateAsync = function (pubKey, fee, name, description, website, tier) {
        var registerCandidateRequest = new dposv3_pb_1.RegisterCandidateRequestV3();
        registerCandidateRequest.setPubKey(pubKey);
        registerCandidateRequest.setFee(fee.toString(10));
        registerCandidateRequest.setName(name);
        registerCandidateRequest.setDescription(description);
        registerCandidateRequest.setWebsite(website);
        registerCandidateRequest.setLocktimeTier(tier);
        return this.callAsync('RegisterCandidate', registerCandidateRequest);
    };
    DPOS3.prototype.unregisterCandidateAsync = function () {
        var unregisterCandidateRequest = new dposv3_pb_1.UnregisterCandidateRequestV3();
        return this.callAsync('UnregisterCandidate', unregisterCandidateRequest);
    };
    DPOS3.prototype.delegateAsync = function (validator, amount, tier, referrer) {
        var delegateRequest = new dposv3_pb_1.DelegateRequest();
        delegateRequest.setValidatorAddress(validator.MarshalPB());
        delegateRequest.setAmount(big_uint_1.marshalBigUIntPB(amount));
        delegateRequest.setLocktimeTier(tier);
        if (referrer) {
            delegateRequest.setReferrer(referrer);
        }
        return this.callAsync('Delegate', delegateRequest);
    };
    DPOS3.prototype.redelegateAsync = function (oldValidator, validator, amount, index, referrer) {
        var redelegateRequest = new dposv3_pb_1.RedelegateRequest();
        redelegateRequest.setFormerValidatorAddress(oldValidator.MarshalPB());
        redelegateRequest.setValidatorAddress(validator.MarshalPB());
        redelegateRequest.setAmount(big_uint_1.marshalBigUIntPB(amount));
        redelegateRequest.setIndex(index);
        if (referrer) {
            redelegateRequest.setReferrer(referrer);
        }
        return this.callAsync('Redelegate', redelegateRequest);
    };
    DPOS3.prototype.consolidateDelegations = function (validator) {
        var req = new dposv3_pb_1.ConsolidateDelegationsRequest();
        req.setValidatorAddress(validator.MarshalPB());
        return this.callAsync('ConsolidateDelegations', req);
    };
    DPOS3.prototype.unbondAsync = function (validator, amount, index) {
        var unbondRequest = new dposv3_pb_1.UnbondRequest();
        unbondRequest.setValidatorAddress(validator.MarshalPB());
        unbondRequest.setAmount(big_uint_1.marshalBigUIntPB(new bn_js_1.default(amount)));
        unbondRequest.setIndex(index);
        return this.callAsync('Unbond', unbondRequest);
    };
    DPOS3.prototype.getDelegation = function (delegation) {
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
            index: delegation.getIndex(),
            lockTime: delegation.getLockTime(),
            lockTimeTier: delegation.getLocktimeTier(),
            state: delegation.getState(),
            referrer: delegation.getReferrer()
        };
    };
    return DPOS3;
}(contract_1.Contract));
exports.DPOS3 = DPOS3;
//# sourceMappingURL=dpos3.js.map