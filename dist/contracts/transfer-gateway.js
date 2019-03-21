"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var transfer_gateway_pb_1 = require("../proto/transfer_gateway_pb");
var big_uint_1 = require("../big-uint");
var crypto_utils_1 = require("../crypto-utils");
var TransferGateway = /** @class */ (function (_super) {
    tslib_1.__extends(TransferGateway, _super);
    function TransferGateway(params) {
        var _this = _super.call(this, params) || this;
        _this.on(contract_1.Contract.EVENT, function (event) {
            if (!event.topics || event.topics.length === 0) {
                return;
            }
            if (event.topics[0] === TransferGateway.tokenWithdrawalSignedEventTopic) {
                var eventData = transfer_gateway_pb_1.TransferGatewayTokenWithdrawalSigned.deserializeBinary(crypto_utils_1.B64ToUint8Array(event.data));
                var tokenId = void 0;
                var tokenAmount = void 0;
                var value = void 0;
                var tokenKind = eventData.getTokenKind();
                switch (tokenKind) {
                    case transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721:
                        tokenId = big_uint_1.unmarshalBigUIntPB(eventData.getTokenId());
                        value = tokenId;
                        break;
                    case transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721X:
                        tokenId = big_uint_1.unmarshalBigUIntPB(eventData.getTokenId());
                    // fallthrough
                    // tslint:disable-next-line: no-switch-case-fall-through
                    default:
                        tokenAmount = big_uint_1.unmarshalBigUIntPB(eventData.getTokenAmount());
                        value = tokenAmount;
                        break;
                }
                _this.emit(TransferGateway.EVENT_TOKEN_WITHDRAWAL, {
                    tokenOwner: address_1.Address.UnmarshalPB(eventData.getTokenOwner()),
                    tokenContract: address_1.Address.UnmarshalPB(eventData.getTokenContract()),
                    tokenKind: tokenKind,
                    tokenId: tokenId,
                    tokenAmount: tokenAmount,
                    sig: eventData.getSig_asU8(),
                    value: value
                });
            }
            else if (event.topics[0] === TransferGateway.contractMappingConfirmedEventTopic) {
                var contractMappingConfirmed = transfer_gateway_pb_1.TransferGatewayContractMappingConfirmed.deserializeBinary(crypto_utils_1.B64ToUint8Array(event.data));
                _this.emit(TransferGateway.EVENT_CONTRACT_MAPPING_CONFIRMED, {
                    foreignContract: address_1.Address.UnmarshalPB(contractMappingConfirmed.getForeignContract()),
                    localContract: address_1.Address.UnmarshalPB(contractMappingConfirmed.getLocalContract())
                });
            }
        });
        return _this;
    }
    TransferGateway.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('gateway')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address for TransferGateway');
                        }
                        return [2 /*return*/, new TransferGateway({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    /**
    * Adds a contract mapping to the DAppChain Gateway using gatway owner signature.
    * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
    */
    TransferGateway.prototype.addAuthorizedContractMappingAsync = function (params) {
        var foreignContract = params.foreignContract, localContract = params.localContract;
        var mappingContractRequest = new transfer_gateway_pb_1.TransferGatewayAddContractMappingRequest();
        mappingContractRequest.setForeignContract(foreignContract.MarshalPB());
        mappingContractRequest.setLocalContract(localContract.MarshalPB());
        return this.callAsync('AddAuthorizedContractMapping', mappingContractRequest);
    };
    /**
     * Adds a contract mapping to the DAppChain Gateway.
     * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
     */
    TransferGateway.prototype.addContractMappingAsync = function (params) {
        var foreignContract = params.foreignContract, localContract = params.localContract, foreignContractCreatorSig = params.foreignContractCreatorSig, foreignContractCreatorTxHash = params.foreignContractCreatorTxHash;
        var mappingContractRequest = new transfer_gateway_pb_1.TransferGatewayAddContractMappingRequest();
        mappingContractRequest.setForeignContract(foreignContract.MarshalPB());
        mappingContractRequest.setLocalContract(localContract.MarshalPB());
        mappingContractRequest.setForeignContractCreatorSig(foreignContractCreatorSig);
        mappingContractRequest.setForeignContractTxHash(foreignContractCreatorTxHash);
        return this.callAsync('AddContractMapping', mappingContractRequest);
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of an ERC721 token from the
     * current DAppChain account to an Ethereum account.
     * @param tokenId ERC721 token ID.
     * @param tokenContract DAppChain address of ERC721 contract.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    TransferGateway.prototype.withdrawERC721Async = function (tokenId, tokenContract, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawTokenRequest();
        req.setTokenKind(transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721);
        req.setTokenId(big_uint_1.marshalBigUIntPB(tokenId));
        req.setTokenContract(tokenContract.MarshalPB());
        if (recipient) {
            req.setRecipient(recipient.MarshalPB());
        }
        return this.callAsync('WithdrawToken', req);
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of ERC721X tokens from the current
     * DAppChain account to an Ethereum account.
     * @param tokenId ERC721X token ID.
     * @param amount Amount of tokenId to withdraw.
     * @param tokenContract DAppChain address of ERC721X contract.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    TransferGateway.prototype.withdrawERC721XAsync = function (tokenId, amount, tokenContract, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawTokenRequest();
        req.setTokenKind(transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721X);
        req.setTokenId(big_uint_1.marshalBigUIntPB(tokenId));
        req.setTokenAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setTokenContract(tokenContract.MarshalPB());
        if (recipient) {
            req.setRecipient(recipient.MarshalPB());
        }
        return this.callAsync('WithdrawToken', req);
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal ERC20 tokens from the current
     * DAppChain account to an Ethereum account.
     * @param amount Amount to withdraw.
     * @param tokenContract DAppChain address of ERC20 contract.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    TransferGateway.prototype.withdrawERC20Async = function (amount, tokenContract, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawTokenRequest();
        req.setTokenKind(transfer_gateway_pb_1.TransferGatewayTokenKind.ERC20);
        req.setTokenAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setTokenContract(tokenContract.MarshalPB());
        if (recipient) {
            req.setRecipient(recipient.MarshalPB());
        }
        return this.callAsync('WithdrawToken', req);
    };
    /**
     * Sends a request to the DAppChain Gateway to begin withdrawal of ETH from the current
     * DAppChain account to an Ethereum account.
     * @param amount Amount to withdraw.
     * @param ethereumGateway Ethereum address of Ethereum Gateway.
     * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
     *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
     *                  address of the Ethereum account mapped to the current DAppChain account.
     * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
     *          request.
     */
    TransferGateway.prototype.withdrawETHAsync = function (amount, ethereumGateway, recipient) {
        var req = new transfer_gateway_pb_1.TransferGatewayWithdrawETHRequest();
        req.setAmount(big_uint_1.marshalBigUIntPB(amount));
        req.setMainnetGateway(ethereumGateway.MarshalPB());
        if (recipient) {
            req.setRecipient(recipient.MarshalPB());
        }
        return this.callAsync('WithdrawETH', req);
    };
    /**
     * Retrieves the current withdrawal receipt (if any) for the given DAppChain account.
     * Withdrawal receipts are created by calling one of the withdraw methods.
     * @param owner DAppChain address of a user account.
     * @returns A promise that will be resolved with the withdrawal receipt, or null if no withdrawal
     *          receipt exists (this indicates there's no withdrawal from the specified account
     *          currently in progress).
     */
    TransferGateway.prototype.withdrawalReceiptAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tgWithdrawReceiptReq, result, receipt, tokenId, tokenAmount, value, tokenKind;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tgWithdrawReceiptReq = new transfer_gateway_pb_1.TransferGatewayWithdrawalReceiptRequest();
                        tgWithdrawReceiptReq.setOwner(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('WithdrawalReceipt', tgWithdrawReceiptReq, new transfer_gateway_pb_1.TransferGatewayWithdrawalReceiptResponse())];
                    case 1:
                        result = _a.sent();
                        receipt = result.getReceipt();
                        if (receipt) {
                            tokenId = void 0;
                            tokenAmount = void 0;
                            value = void 0;
                            tokenKind = receipt.getTokenKind();
                            switch (tokenKind) {
                                case transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721:
                                    tokenId = big_uint_1.unmarshalBigUIntPB(receipt.getTokenId());
                                    value = tokenId;
                                    break;
                                case transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721X:
                                    tokenId = big_uint_1.unmarshalBigUIntPB(receipt.getTokenId());
                                // fallthrough
                                // tslint:disable-next-line: no-switch-case-fall-through
                                default:
                                    tokenAmount = big_uint_1.unmarshalBigUIntPB(receipt.getTokenAmount());
                                    value = tokenAmount;
                                    break;
                            }
                            return [2 /*return*/, {
                                    tokenOwner: address_1.Address.UnmarshalPB(receipt.getTokenOwner()),
                                    tokenContract: address_1.Address.UnmarshalPB(receipt.getTokenContract()),
                                    tokenKind: tokenKind,
                                    tokenId: tokenId,
                                    tokenAmount: tokenAmount,
                                    withdrawalNonce: new bn_js_1.default(receipt.getWithdrawalNonce()),
                                    oracleSignature: receipt.getOracleSignature_asU8(),
                                    value: value
                                }];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Attempt to transfer tokens that originated from the specified Ethereum contract, and that have
     * been deposited to the Ethereum Gateway, but haven't yet been received by the depositors on the
     * DAppChain because of a missing identity or contract mapping. This method can only be called by
     * the creator of the specified token contract, or the Gateway owner.
     *
     * @param tokenContract token contract to reclaim the tokens
     */
    TransferGateway.prototype.reclaimContractTokensAsync = function (tokenContract) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req;
            return tslib_1.__generator(this, function (_a) {
                req = new transfer_gateway_pb_1.TransferGatewayReclaimContractTokensRequest();
                req.setTokenContract(tokenContract.MarshalPB());
                return [2 /*return*/, this.callAsync('ReclaimContractTokens', req)];
            });
        });
    };
    TransferGateway.prototype.getUnclaimedTokensAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, result, unclaimedTokens, tokens, _i, unclaimedTokens_1, token, tokenKind, tokenIds, tokenAmounts, _a, _b, amt, _c, _d, amt, _e, _f, amt;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        req = new transfer_gateway_pb_1.TransferGatewayGetUnclaimedTokensRequest();
                        req.setOwner(owner.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('GetUnclaimedTokens', req, new transfer_gateway_pb_1.TransferGatewayGetUnclaimedTokensResponse())];
                    case 1:
                        result = _g.sent();
                        unclaimedTokens = result.getUnclaimedTokensList();
                        tokens = [];
                        for (_i = 0, unclaimedTokens_1 = unclaimedTokens; _i < unclaimedTokens_1.length; _i++) {
                            token = unclaimedTokens_1[_i];
                            tokenKind = token.getTokenKind();
                            tokenIds = [];
                            tokenAmounts = [];
                            if (tokenKind === transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721) {
                                // Set only the tokenId for ERC721
                                for (_a = 0, _b = token.getAmountsList(); _a < _b.length; _a++) {
                                    amt = _b[_a];
                                    tokenIds.push(big_uint_1.unmarshalBigUIntPB(amt.getTokenId()));
                                }
                            }
                            else if (tokenKind === transfer_gateway_pb_1.TransferGatewayTokenKind.ERC721X) {
                                // Set both the tokenId and the tokenAmounts for ERC721x
                                for (_c = 0, _d = token.getAmountsList(); _c < _d.length; _c++) {
                                    amt = _d[_c];
                                    tokenIds.push(big_uint_1.unmarshalBigUIntPB(amt.getTokenId()));
                                    tokenAmounts.push(big_uint_1.unmarshalBigUIntPB(amt.getTokenAmount()));
                                }
                            }
                            else {
                                // Set only amount for all other cases
                                for (_e = 0, _f = token.getAmountsList(); _e < _f.length; _e++) {
                                    amt = _f[_e];
                                    tokenAmounts.push(big_uint_1.unmarshalBigUIntPB(amt.getTokenAmount()));
                                }
                            }
                            tokens.push({
                                tokenContract: address_1.Address.UnmarshalPB(token.getTokenContract()),
                                tokenKind: tokenKind,
                                tokenAmounts: tokenAmounts,
                                tokenIds: tokenIds
                            });
                        }
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    /**
     * Attempt to transfer any tokens that the caller may have deposited into the Ethereum Gateway
     * but hasn't yet received from the DAppChain Gateway because of a missing identity or contract
     * mapping.
     *
     * @param depositors Optional list of DAppChain accounts to reclaim tokens for, when set tokens
     *                   will be reclaimed for the specified accounts instead of the caller's account.
     *                   NOTE: Only the Gateway owner is authorized to provide a list of accounts.
     */
    TransferGateway.prototype.reclaimDepositorTokensAsync = function (depositors) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req;
            return tslib_1.__generator(this, function (_a) {
                req = new transfer_gateway_pb_1.TransferGatewayReclaimDepositorTokensRequest();
                if (depositors && depositors.length > 0) {
                    req.setDepositorsList(depositors.map(function (address) { return address.MarshalPB(); }));
                }
                return [2 /*return*/, this.callAsync('ReclaimDepositorTokens', req)];
            });
        });
    };
    // LoomJS user events
    TransferGateway.EVENT_TOKEN_WITHDRAWAL = 'event_token_withdrawal';
    TransferGateway.EVENT_CONTRACT_MAPPING_CONFIRMED = 'event_contract_mapping_confirmed';
    // Events from Loomchain
    TransferGateway.tokenWithdrawalSignedEventTopic = 'event:TokenWithdrawalSigned';
    TransferGateway.contractMappingConfirmedEventTopic = 'event:ContractMappingConfirmed';
    return TransferGateway;
}(contract_1.Contract));
exports.TransferGateway = TransferGateway;
//# sourceMappingURL=transfer-gateway.js.map