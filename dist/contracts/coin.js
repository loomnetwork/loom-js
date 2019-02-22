"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var contract_1 = require("../contract");
var coin_pb_1 = require("../proto/coin_pb");
var big_uint_1 = require("../big-uint");
var Coin = /** @class */ (function (_super) {
    tslib_1.__extends(Coin, _super);
    function Coin(params) {
        return _super.call(this, params) || this;
    }
    Coin.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('coin')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new Coin({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    Coin.prototype.getTotalSupplyAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var totalSupplyReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        totalSupplyReq = new coin_pb_1.TotalSupplyRequest();
                        return [4 /*yield*/, this.staticCallAsync('TotalSupply', totalSupplyReq, new coin_pb_1.TotalSupplyResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getTotalSupply())];
                }
            });
        });
    };
    Coin.prototype.getBalanceOfAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var balanceOfReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        balanceOfReq = new coin_pb_1.BalanceOfRequest();
                        balanceOfReq.setOwner(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('BalanceOf', balanceOfReq, new coin_pb_1.BalanceOfResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getBalance())];
                }
            });
        });
    };
    Coin.prototype.getAllowanceAsync = function (owner, spender) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allowanceReq, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allowanceReq = new coin_pb_1.AllowanceRequest();
                        allowanceReq.setOwner(owner.MarshalPB());
                        allowanceReq.setSpender(spender.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('Allowance', allowanceReq, new coin_pb_1.AllowanceResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(result.getAmount())];
                }
            });
        });
    };
    Coin.prototype.approveAsync = function (spender, amount) {
        var approveReq = new coin_pb_1.ApproveRequest();
        approveReq.setSpender(spender.MarshalPB());
        approveReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync('Approve', approveReq);
    };
    Coin.prototype.transferAsync = function (to, amount) {
        var transferReq = new coin_pb_1.TransferRequest();
        transferReq.setTo(to.MarshalPB());
        transferReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync('Transfer', transferReq);
    };
    Coin.prototype.transferFromAsync = function (from, to, amount) {
        var transferFromReq = new coin_pb_1.TransferFromRequest();
        transferFromReq.setFrom(from.MarshalPB());
        transferFromReq.setTo(to.MarshalPB());
        transferFromReq.setAmount(big_uint_1.marshalBigUIntPB(amount));
        return this.callAsync('TransferFrom', transferFromReq);
    };
    return Coin;
}(contract_1.Contract));
exports.Coin = Coin;
//# sourceMappingURL=coin.js.map