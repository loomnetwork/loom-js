"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dappchain_client_1 = require("./dappchain-client");
var CachedDAppChainPlasmaClient = /** @class */ (function (_super) {
    tslib_1.__extends(CachedDAppChainPlasmaClient, _super);
    function CachedDAppChainPlasmaClient(params) {
        var _this = this;
        var dAppClient = params.dAppClient, callerAddress = params.callerAddress, database = params.database, _a = params.contractName, contractName = _a === void 0 ? 'plasmacash' : _a;
        _this = _super.call(this, { dAppClient: dAppClient, callerAddress: callerAddress, contractName: contractName }) || this;
        _this._database = database;
        return _this;
    }
    CachedDAppChainPlasmaClient.prototype.getPlasmaTxAsync = function (slot, blockNum) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._database.exists(slot, blockNum)) return [3 /*break*/, 1];
                        tx = this._database.getTx(slot, blockNum);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, _super.prototype.getPlasmaTxAsync.call(this, slot, blockNum)];
                    case 2:
                        tx = _a.sent();
                        this._database.receiveCoin(slot, blockNum, tx);
                        _a.label = 3;
                    case 3: return [2 /*return*/, tx];
                }
            });
        });
    };
    CachedDAppChainPlasmaClient.prototype.getAllCoins = function () {
        return this._database.getAllCoinSlots();
    };
    return CachedDAppChainPlasmaClient;
}(dappchain_client_1.DAppChainPlasmaClient));
exports.CachedDAppChainPlasmaClient = CachedDAppChainPlasmaClient;
//# sourceMappingURL=cached-dappchain-client.js.map