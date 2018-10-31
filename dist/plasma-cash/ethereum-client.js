"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var crypto_utils_1 = require("../crypto-utils");
var signed_contract_1 = tslib_1.__importDefault(require("./signed-contract"));
var PlasmaCoinMode;
(function (PlasmaCoinMode) {
    PlasmaCoinMode[PlasmaCoinMode["ETH"] = 0] = "ETH";
    PlasmaCoinMode[PlasmaCoinMode["ERC20"] = 1] = "ERC20";
    PlasmaCoinMode[PlasmaCoinMode["ERC721"] = 2] = "ERC721";
})(PlasmaCoinMode = exports.PlasmaCoinMode || (exports.PlasmaCoinMode = {}));
var PlasmaCoinState;
(function (PlasmaCoinState) {
    PlasmaCoinState[PlasmaCoinState["Deposited"] = 0] = "Deposited";
    PlasmaCoinState[PlasmaCoinState["Exiting"] = 1] = "Exiting";
    PlasmaCoinState[PlasmaCoinState["Exited"] = 2] = "Exited";
})(PlasmaCoinState = exports.PlasmaCoinState || (exports.PlasmaCoinState = {}));
function marshalChallengeEvent(data) {
    var slot = data.slot, txHash = data.txHash;
    return {
        slot: new bn_js_1.default(slot),
        txHash: txHash
    };
}
exports.marshalChallengeEvent = marshalChallengeEvent;
// TODO: This probably shouldn't be exposed, instead add API to EthereumPlasmaClient to retrieve
// already marshalled event data
function marshalDepositEvent(data) {
    var slot = data.slot, blockNumber = data.blockNumber, denomination = data.denomination, from = data.from, contractAddress = data.contractAddress;
    return {
        slot: new bn_js_1.default(slot),
        blockNumber: new bn_js_1.default(blockNumber),
        denomination: new bn_js_1.default(denomination),
        from: from,
        contractAddress: contractAddress
    };
}
exports.marshalDepositEvent = marshalDepositEvent;
var EthereumPlasmaClient = /** @class */ (function () {
    function EthereumPlasmaClient(web3, ethAccount, plasmaContractAddr) {
        this._web3 = web3;
        var plasmaABI = require("./contracts/plasma-cash-abi.json");
        this._plasmaContract = new signed_contract_1.default(web3, plasmaABI, plasmaContractAddr, ethAccount).instance;
    }
    Object.defineProperty(EthereumPlasmaClient.prototype, "plasmaCashContract", {
        /**
         * Web3 contract instance of the Plasma Cash contract on Ethereum.
         */
        get: function () {
            return this._plasmaContract;
        },
        enumerable: true,
        configurable: true
    });
    EthereumPlasmaClient.prototype.getExitAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, from, exit;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, from = params.from;
                        return [4 /*yield*/, this._plasmaContract.getExit(slot.toString())];
                    case 1:
                        exit = _a.sent();
                        return [2 /*return*/, {
                                slot: slot,
                                owner: exit[0],
                                prevBlock: new bn_js_1.default(exit[1]),
                                exitBlock: new bn_js_1.default(exit[2]),
                                state: parseInt(exit[3], 10)
                            }];
                }
            });
        });
    };
    EthereumPlasmaClient.prototype.checkMembershipAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var leaf, root, slot, proof, from, isIncluded;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        leaf = params.leaf, root = params.root, slot = params.slot, proof = params.proof, from = params.from;
                        return [4 /*yield*/, this._plasmaContract.checkMembership(leaf, root, slot.toString(), proof)];
                    case 1:
                        isIncluded = _a.sent();
                        return [2 /*return*/, isIncluded];
                }
            });
        });
    };
    EthereumPlasmaClient.prototype.getBlockRootAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blockNumber, from, root;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockNumber = params.blockNumber, from = params.from;
                        return [4 /*yield*/, this._plasmaContract.getBlockRoot(blockNumber.toString())];
                    case 1:
                        root = _a.sent();
                        return [2 /*return*/, root];
                }
            });
        });
    };
    EthereumPlasmaClient.prototype.getPlasmaCoinAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, from, coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, from = params.from;
                        return [4 /*yield*/, this._plasmaContract.getPlasmaCoin(slot.toString())];
                    case 1:
                        coin = _a.sent();
                        return [2 /*return*/, {
                                slot: slot,
                                uid: new bn_js_1.default(coin[0]),
                                depositBlockNum: new bn_js_1.default(coin[1]),
                                denomination: new bn_js_1.default(coin[2]),
                                owner: coin[3],
                                state: parseInt(coin[4], 10),
                                mode: parseInt(coin[5], 10),
                                contractAddress: coin[6]
                            }];
                }
            });
        });
    };
    /**
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.startExitAsync = function (params) {
        var slot = params.slot, exitTx = params.exitTx, exitBlockNum = params.exitBlockNum, prevTx = params.prevTx, prevBlockNum = params.prevBlockNum, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x';
        var exitTxBytes = exitTx.rlpEncode();
        var bond = this._web3.utils.toWei('0.1', 'ether');
        return this._plasmaContract.startExit([
            slot.toString(),
            prevTxBytes,
            exitTxBytes,
            prevTx ? prevTx.proof : '0x',
            exitTx.proof,
            exitTx.sig,
            [prevBlockNum ? prevBlockNum.toString() : 0, exitBlockNum.toString()]
        ], bond);
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.finalizeExitsAsync = function (params) {
        return this._plasmaContract.finalizeExits([]);
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawAsync = function (params) {
        var slot = params.slot, rest = tslib_1.__rest(params, ["slot"]);
        return this._plasmaContract.withdraw([slot.toString()]);
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawBondsAsync = function (params) {
        return this._plasmaContract.withdrawBonds([]);
    };
    /**
     * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeAfterAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, rest = tslib_1.__rest(params, ["slot", "challengingBlockNum", "challengingTx"]);
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.challengeAfter([
            slot.toString(),
            challengingBlockNum.toString(),
            txBytes,
            challengingTx.proof,
            challengingTx.sig
        ]);
    };
    /**
     * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBetweenAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, rest = tslib_1.__rest(params, ["slot", "challengingBlockNum", "challengingTx"]);
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.challengeBetween([
            slot.toString(),
            challengingBlockNum.toString(),
            txBytes,
            challengingTx.proof,
            challengingTx.sig
        ]);
    };
    /**
     * `Invalid History Challenge`: Challenge a coin with invalid history.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTx = params.challengingTx, challengingBlockNum = params.challengingBlockNum, prevTx = params.prevTx, prevBlockNum = params.prevBlockNum, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x';
        var challengingTxBytes = challengingTx.rlpEncode();
        var bond = this._web3.utils.toWei('0.1', 'ether');
        return this._plasmaContract.challengeBefore([
            slot.toString(),
            prevTxBytes,
            challengingTxBytes,
            prevTx ? prevTx.proof : '0x',
            challengingTx.proof,
            challengingTx.sig,
            [prevBlockNum ? prevBlockNum.toString() : 0, challengingBlockNum.toString()]
        ], bond);
    };
    /**
     * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.respondChallengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTxHash = params.challengingTxHash, respondingBlockNum = params.respondingBlockNum, respondingTx = params.respondingTx, rest = tslib_1.__rest(params, ["slot", "challengingTxHash", "respondingBlockNum", "respondingTx"]);
        var respondingTxBytes = respondingTx.rlpEncode();
        return this._plasmaContract.respondChallengeBefore([
            slot.toString(),
            challengingTxHash,
            respondingBlockNum.toString(),
            respondingTxBytes,
            respondingTx.proof,
            respondingTx.sig
        ]);
    };
    /**
     * Submits a Plasma block to the Plasma Cash Solidity contract on Ethereum.
     *
     * @returns Web3 tx receipt object.
     *
     * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
     * will be permitted to make this request.
     */
    EthereumPlasmaClient.prototype.debugSubmitBlockAsync = function (params) {
        var block = params.block, from = params.from;
        return this._plasmaContract.submitBlock([crypto_utils_1.bytesToHexAddr(block.merkleHash)]);
    };
    return EthereumPlasmaClient;
}());
exports.EthereumPlasmaClient = EthereumPlasmaClient;
//# sourceMappingURL=ethereum-client.js.map