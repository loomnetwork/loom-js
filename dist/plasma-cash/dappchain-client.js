"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var plasma_cash_block_1 = require("./plasma-cash-block");
var big_uint_1 = require("../big-uint");
var plasma_cash_pb_1 = require("../proto/plasma_cash_pb");
var DAppChainPlasmaClient = /** @class */ (function () {
    function DAppChainPlasmaClient(params) {
        var dAppClient = params.dAppClient, callerAddress = params.callerAddress, database = params.database, _a = params.contractName, contractName = _a === void 0 ? 'plasmacash' : _a;
        this._dAppClient = dAppClient;
        this._callerAddress = callerAddress;
        this._database = database;
        this._plasmaContractName = contractName;
    }
    Object.defineProperty(DAppChainPlasmaClient.prototype, "contractName", {
        get: function () {
            return this._plasmaContractName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DAppChainPlasmaClient.prototype, "database", {
        get: function () {
            return this._database;
        },
        enumerable: true,
        configurable: true
    });
    DAppChainPlasmaClient.prototype._resolvePlasmaContractAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var addr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._plasmaContract) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dAppClient.getContractAddressAsync(this._plasmaContractName)];
                    case 1:
                        addr = _a.sent();
                        if (!addr) {
                            throw new Error('Failed to resolve Plasma Cash contract address.');
                        }
                        this._plasmaContract = new contract_1.Contract({
                            contractAddr: addr,
                            contractName: this._plasmaContractName,
                            callerAddr: this._callerAddress,
                            client: this._dAppClient
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._plasmaContract];
                }
            });
        });
    };
    /**
     * Retrieves the latest finalized Plasma block number from the DAppChain.
     */
    DAppChainPlasmaClient.prototype.getCurrentPlasmaBlockNumAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req, resp, blockHeight;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetCurrentBlockRequest();
                        return [4 /*yield*/, contract.staticCallAsync('GetCurrentBlockRequest', req, new plasma_cash_pb_1.GetCurrentBlockResponse())];
                    case 2:
                        resp = _a.sent();
                        blockHeight = resp.getBlockHeight();
                        if (!blockHeight) {
                            throw new Error('Invalid response: missing block height.');
                        }
                        return [2 /*return*/, big_uint_1.unmarshalBigUIntPB(blockHeight)];
                }
            });
        });
    };
    /**
     * Retrieves a Plasma block from the DAppChain.
     *
     * @param blockNum Height of the block to be retrieved.
     */
    DAppChainPlasmaClient.prototype.getPlasmaBlockAtAsync = function (blockNum) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req, resp;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetBlockRequest();
                        req.setBlockHeight(big_uint_1.marshalBigUIntPB(blockNum));
                        return [4 /*yield*/, contract.staticCallAsync('GetBlockRequest', req, new plasma_cash_pb_1.GetBlockResponse())];
                    case 2:
                        resp = _a.sent();
                        return [2 /*return*/, plasma_cash_block_1.unmarshalPlasmaBlockPB(resp.getBlock())];
                }
            });
        });
    };
    /**
     * Retrieves a merkle proof from the DAppChain regarding a coin at a block
     *
     * @param blockNum Height of the block to be retrieved.
     * @param slot The coin id
     * @return
     */
    DAppChainPlasmaClient.prototype.getPlasmaTxAsync = function (slot, blockNum) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req, resp, rawTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetPlasmaTxRequest();
                        req.setBlockHeight(big_uint_1.marshalBigUIntPB(blockNum));
                        req.setSlot(slot.toString(10));
                        return [4 /*yield*/, contract.staticCallAsync('GetPlasmaTxRequest', req, new plasma_cash_pb_1.GetPlasmaTxResponse())];
                    case 2:
                        resp = _a.sent();
                        rawTx = resp.getPlasmaTx();
                        // If we're getting a non-existing transaction, we just return its slot and its non-inclusion proof
                        if (!rawTx.hasNewOwner()) {
                            return [2 /*return*/, new plasma_cash_tx_1.PlasmaCashTx({
                                    slot: slot,
                                    prevBlockNum: new bn_js_1.default(0),
                                    denomination: 1,
                                    newOwner: '0x0000000000000000000000000000000000000000',
                                    proof: rawTx.getProof_asU8()
                                })];
                        }
                        return [2 /*return*/, plasma_cash_tx_1.unmarshalPlasmaTxPB(resp.getPlasmaTx())];
                }
            });
        });
    };
    /**
     * Retrieves a merkle proof from the DAppChain regarding a coin at a block
     *
     * @param blockNum Height of the block to be retrieved.
     * @param slot The coin id
     * @return
     */
    DAppChainPlasmaClient.prototype.getUserSlotsAsync = function (_ethAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req, resp;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.GetUserSlotsRequest();
                        req.setFrom(_ethAddress.MarshalPB());
                        return [4 /*yield*/, contract.staticCallAsync('GetUserSlotsRequest', req, new plasma_cash_pb_1.GetUserSlotsResponse())];
                    case 2:
                        resp = _a.sent();
                        return [2 /*return*/, resp.getSlotsList().map(function (s) { return new bn_js_1.default(s); })];
                }
            });
        });
    };
    /**
     * Transfers a Plasma token from one entity to another.
     */
    DAppChainPlasmaClient.prototype.sendTxAsync = function (tx) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tx.sig) {
                            throw new Error('PlasmaCashTx must be signed before being sent to DAppChain');
                        }
                        return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.PlasmaTxRequest();
                        req.setPlasmatx(plasma_cash_tx_1.marshalPlasmaTxPB(tx));
                        return [4 /*yield*/, contract.callAsync('PlasmaTxRequest', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Requests that the DAppChain prepares a Plasma block for submission to Ethereum.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    DAppChainPlasmaClient.prototype.debugFinalizeBlockAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, req;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        req = new plasma_cash_pb_1.SubmitBlockToMainnetRequest();
                        return [4 /*yield*/, contract.callAsync('SubmitBlockToMainnet', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Submits a Plasma deposit from Ethereum to the DAppChain.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    DAppChainPlasmaClient.prototype.debugSubmitDepositAsync = function (deposit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contract, ownerAddr, tokenAddr, req;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._resolvePlasmaContractAsync()];
                    case 1:
                        contract = _a.sent();
                        ownerAddr = new address_1.Address('eth', address_1.LocalAddress.fromHexString(deposit.from));
                        tokenAddr = new address_1.Address('eth', address_1.LocalAddress.fromHexString(deposit.contractAddress));
                        req = new plasma_cash_pb_1.DepositRequest();
                        req.setSlot(deposit.slot.toString(10));
                        req.setDepositBlock(big_uint_1.marshalBigUIntPB(deposit.blockNumber));
                        req.setDenomination(big_uint_1.marshalBigUIntPB(deposit.denomination));
                        req.setFrom(ownerAddr.MarshalPB());
                        req.setContract(tokenAddr.MarshalPB());
                        return [4 /*yield*/, contract.callAsync('DepositRequest', req)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DAppChainPlasmaClient;
}());
exports.DAppChainPlasmaClient = DAppChainPlasmaClient;
//# sourceMappingURL=dappchain-client.js.map