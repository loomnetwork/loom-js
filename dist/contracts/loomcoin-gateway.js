"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var transfer_gateway_1 = require("./transfer-gateway");
var transfer_gateway_pb_1 = require("../proto/transfer_gateway_pb");
var big_uint_1 = require("../big-uint");
var LoomCoinTransferGateway = /** @class */ (function (_super) {
    tslib_1.__extends(LoomCoinTransferGateway, _super);
    function LoomCoinTransferGateway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoomCoinTransferGateway.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('loomcoin-gateway')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address for TransferGateway');
                        }
                        return [2 /*return*/, new LoomCoinTransferGateway({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of LOOM from the current
     * DAppChain account to an Ethereum account.
     * @param amount Amount to withdraw.
     * @param mainnetLoomcoinAddress Ethereum address of LOOM coin contract.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    LoomCoinTransferGateway.prototype.withdrawLoomCoinAsync = function (amount, mainnetLoomcoinAddress, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawLoomCoinRequest();
        req.setAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setTokenContract(mainnetLoomcoinAddress.MarshalPB());
        if (recipient) {
            req.setRecipient(recipient.MarshalPB());
        }
        return this.callAsync('WithdrawLoomCoin', req);
    };
    return LoomCoinTransferGateway;
}(transfer_gateway_1.TransferGateway));
exports.LoomCoinTransferGateway = LoomCoinTransferGateway;
//# sourceMappingURL=loomcoin-gateway.js.map