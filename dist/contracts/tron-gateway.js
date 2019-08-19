"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var transfer_gateway_1 = require("./transfer-gateway");
var TronTransferGateway = /** @class */ (function (_super) {
    tslib_1.__extends(TronTransferGateway, _super);
    function TronTransferGateway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TronTransferGateway.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('tron-gateway')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address for Tron TransferGateway');
                        }
                        return [2 /*return*/, new TronTransferGateway({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    return TronTransferGateway;
}(transfer_gateway_1.TransferGateway));
exports.TronTransferGateway = TronTransferGateway;
//# sourceMappingURL=tron-gateway.js.map