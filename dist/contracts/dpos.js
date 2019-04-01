"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var dpos_pb_1 = require("../proto/dpos_pb");
var DPOS = /** @class */ (function (_super) {
    tslib_1.__extends(DPOS, _super);
    function DPOS(params) {
        return _super.call(this, params) || this;
    }
    DPOS.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('dpos')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new DPOS({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    DPOS.prototype.registerCandidateAsync = function (pubKey) {
        var registerCandidateReq = new dpos_pb_1.RegisterCandidateRequest();
        registerCandidateReq.setPubKey(pubKey);
        return this.callAsync('RegisterCandidate', registerCandidateReq);
    };
    DPOS.prototype.unregisterCandidateAsync = function () {
        var unregisterCandidateReq = new dpos_pb_1.UnregisterCandidateRequest();
        return this.callAsync('UnregisterCandidate', unregisterCandidateReq);
    };
    DPOS.prototype.voteAsync = function (candidateAddress, amount) {
        var voteReq = new dpos_pb_1.VoteRequest();
        voteReq.setCandidateAddress(candidateAddress.MarshalPB());
        voteReq.setAmount(amount);
        return this.callAsync('Vote', voteReq);
    };
    DPOS.prototype.electAsync = function () {
        var electReq = new dpos_pb_1.ElectRequest();
        return this.callAsync('Elect', electReq);
    };
    DPOS.prototype.getCandidatesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listCandidatesReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listCandidatesReq = new dpos_pb_1.ListCandidateRequest();
                        return [4 /*yield*/, this.staticCallAsync('ListCandidates', listCandidatesReq, new dpos_pb_1.ListCandidateResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getCandidatesList().map(function (canditate) {
                                return {
                                    address: address_1.Address.UnmarshalPB(canditate.getAddress()),
                                    pubKey: canditate.getPubKey_asU8()
                                };
                            })];
                }
            });
        });
    };
    DPOS.prototype.getWitnessesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listWitnessesReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listWitnessesReq = new dpos_pb_1.ListWitnessesRequest();
                        return [4 /*yield*/, this.staticCallAsync('ListWitnesses', listWitnessesReq, new dpos_pb_1.ListWitnessesResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getWitnessesList().map(function (witness) {
                                return {
                                    pubKey: witness.getPubKey_asU8(),
                                    voteTotal: new bn_js_1.default(witness.getPowerTotal()),
                                    powerTotal: new bn_js_1.default(witness.getPowerTotal())
                                };
                            })];
                }
            });
        });
    };
    return DPOS;
}(contract_1.Contract));
exports.DPOS = DPOS;
//# sourceMappingURL=dpos.js.map