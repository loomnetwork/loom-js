"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
/**
 * Wrapper for a Web3 ERC721 contract.
 */
var EthErc721Contract = /** @class */ (function () {
    /**
     * @param contract Web3 contract instance.
     */
    function EthErc721Contract(contract) {
        this.contract = contract;
    }
    EthErc721Contract.prototype.balanceOfAsync = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var balance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.methods.balanceOf(address).call()];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(balance)];
                }
            });
        });
    };
    return EthErc721Contract;
}());
exports.EthErc721Contract = EthErc721Contract;
//# sourceMappingURL=eth-erc721-contract.js.map