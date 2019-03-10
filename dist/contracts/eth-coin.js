"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coin_1 = require("./coin");
var EthCoin = /** @class */ (function (_super) {
    tslib_1.__extends(EthCoin, _super);
    function EthCoin(params) {
        return _super.call(this, params) || this;
    }
    EthCoin.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('ethcoin')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new EthCoin({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    return EthCoin;
}(coin_1.Coin));
exports.EthCoin = EthCoin;
//# sourceMappingURL=eth-coin.js.map