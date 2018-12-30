"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var eth_erc721_contract_1 = require("./eth-erc721-contract");
var config_1 = require("./config");
var EthCardsContract = /** @class */ (function (_super) {
    tslib_1.__extends(EthCardsContract, _super);
    function EthCardsContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EthCardsContract.prototype.registerAsync = function (address) {
        return this.contract.methods.register().send({ from: address, gas: config_1.DEFAULT_GAS });
    };
    EthCardsContract.prototype.depositToPlasmaAsync = function (params) {
        var tokenId = params.tokenId, from = params.from;
        return this.contract.methods.depositToPlasma(tokenId).send({ from: from, gas: config_1.DEFAULT_GAS });
    };
    return EthCardsContract;
}(eth_erc721_contract_1.EthErc721Contract));
exports.EthCardsContract = EthCardsContract;
//# sourceMappingURL=cards-contract.js.map