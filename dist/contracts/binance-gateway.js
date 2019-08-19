"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var transfer_gateway_1 = require("./transfer-gateway");
var transfer_gateway_pb_1 = require("../proto/transfer_gateway_pb");
var big_uint_1 = require("../big-uint");
var BinanceTransferGateway = /** @class */ (function (_super) {
    tslib_1.__extends(BinanceTransferGateway, _super);
    function BinanceTransferGateway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BinanceTransferGateway.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('binance-gateway')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address for Binance TransferGateway');
                        }
                        return [2 /*return*/, new BinanceTransferGateway({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of LOOM tokens from the current
     * DAppChain account to an account on Binance Chain. Before calling this method the user
     * attempting to withdraw the tokens must approve the DAppChain Gateway to transfer the given
     * amount plus the withdrawal fee (which is always charged in BNB).
     * @param amount Amount to withdraw (not including the withdrawal fee).
     * @param recipient Binance address of the account the tokens should be withdrawn to.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    BinanceTransferGateway.prototype.withdrawLoomAsync = function (amount, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawLoomCoinRequest();
        req.setAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setRecipient(recipient.MarshalPB());
        return this.callAsync('WithdrawLoomCoin', req);
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of BEP2 tokens from the current
     * DAppChain account to an account on Binance Chain. Before calling this method the user
     * attempting to withdraw the tokens must approve the DAppChain Gateway to transfer the given
     * amount plus the withdrawal fee (which is always charged in BNB).
     * @param amount Amount to withdraw (not including the withdrawal fee).
     * @param tokenContract DAppChain address of BEP2 contract.
     * @param recipient Binance address of the account the tokens should be withdrawn to.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    BinanceTransferGateway.prototype.withdrawTokenAsync = function (amount, tokenContract, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawTokenRequest();
        req.setTokenKind(transfer_gateway_pb_1.TransferGatewayTokenKind.BEP2);
        req.setTokenAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setTokenContract(tokenContract.MarshalPB());
        req.setRecipient(recipient.MarshalPB());
        return this.callAsync('WithdrawToken', req);
    };
    /**
     * Sends a request to the DAppChain Gateway to resubmit a previously rejected token withdrawal
     * from the current DAppChain account. This is currently only supported by the Binance gateway.
     * Only the original withdrawer can resubmit a reject withdrawal.
     */
    BinanceTransferGateway.prototype.resubmitWithdrawalAsync = function () {
        var req = new transfer_gateway_pb_1.TransferGatewayResubmitWithdrawalRequest();
        return this.callAsync('ResubmitWithdrawal', req);
    };
    return BinanceTransferGateway;
}(transfer_gateway_1.TransferGateway));
exports.BinanceTransferGateway = BinanceTransferGateway;
//# sourceMappingURL=binance-gateway.js.map