"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
var ethers_1 = require("ethers");
var helpers_1 = require("../helpers");
var debugLog = debug_1.default('plasma-cash:ethereum-client');
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
    function EthereumPlasmaClient(_ethers, plasmaContractAddr, eventsEndpoint) {
        this._ethers = _ethers;
        var plasmaABI = require("./contracts/plasma-cash-abi.json");
        this._plasmaContract = new ethers_1.ethers.Contract(plasmaContractAddr, plasmaABI, this._ethers);
        // Setup a second instance of the contract because Metamask does not support filtering events
        // Use ethers here for listening to events
        var web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(eventsEndpoint));
        this._web3 = web3;
        this._plasmaEventListener = new web3.eth.Contract(plasmaABI, plasmaContractAddr);
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
    Object.defineProperty(EthereumPlasmaClient.prototype, "plasmaEvents", {
        /**
         * Web3 contract instance of the Plasma Cash contract linked to a wss enabled endpoint for listening to events
         */
        get: function () {
            return this._plasmaEventListener;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EthereumPlasmaClient.prototype, "web3", {
        get: function () {
            return this._web3;
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
                        return [4 /*yield*/, this._plasmaContract.getExit('0x' + slot.toString(16))];
                    case 1:
                        exit = _a.sent();
                        return [2 /*return*/, {
                                slot: slot,
                                owner: exit[0],
                                prevBlock: helpers_1.hexBN(exit[1]),
                                exitBlock: helpers_1.hexBN(exit[2]),
                                state: parseInt(exit[3], 10),
                                timestamp: helpers_1.hexBN(exit[4])
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
                        return [4 /*yield*/, this._plasmaContract.checkMembership(leaf, root, '0x' + slot.toString(16), proof)];
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
                        return [4 /*yield*/, this._plasmaContract.getBlockRoot('0x' + blockNumber.toString(16))];
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
                        return [4 /*yield*/, this._plasmaContract.getPlasmaCoin('0x' + slot.toString(16))];
                    case 1:
                        coin = _a.sent();
                        return [2 /*return*/, {
                                slot: slot,
                                uid: helpers_1.hexBN(coin[0]),
                                depositBlockNum: helpers_1.hexBN(coin[1]),
                                denomination: helpers_1.hexBN(coin[2]),
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
        // @ts-ignore
        var bond = ethers_1.ethers.utils.parseEther('0.1')._hex;
        var prevBlk;
        if (prevBlockNum !== undefined) {
            prevBlk = '0x' + prevBlockNum.toString(16);
        }
        else {
            prevBlk = 0;
        }
        return this._plasmaContract.startExit('0x' + slot.toString(16), prevTxBytes, exitTxBytes, prevTx ? prevTx.proof : '0x', exitTx.proof, exitTx.sig, [prevBlk, '0x' + exitBlockNum.toString(16)], { value: bond, gasLimit: gas });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.cancelExitAsync = function (params) {
        var slot = params.slot, gas = params.gas;
        return this._plasmaContract.cancelExit('0x' + slot.toString(16), { gasLimit: gas });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.cancelExitsAsync = function (params) {
        var slots = params.slots, gas = params.gas;
        return this._plasmaContract.cancelExits(slots.map(function (s) { return '0x' + s.toString(16); }), {
            gasLimit: gas
        });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.finalizeExitAsync = function (params) {
        var slot = params.slot, gas = params.gas;
        return this._plasmaContract.finalizeExit('0x' + slot.toString(16), { gasLimit: gas });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.finalizeExitsAsync = function (params) {
        var slots = params.slots, gas = params.gas;
        return this._plasmaContract.finalizeExits(slots.map(function (s) { return '0x' + s.toString(16); }), {
            gasLimit: gas
        });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawAsync = function (params) {
        var slot = params.slot, gas = params.gas;
        return this._plasmaContract.withdraw('0x' + slot.toString(16), { gasLimit: gas });
    };
    /**
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.withdrawBondsAsync = function (params) {
        var gas = params.gas;
        return this._plasmaContract.withdrawBonds({ gasLimit: gas });
    };
    /**
     * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeAfterAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        debugLog('Challenging with', params);
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.challengeAfter('0x' + slot.toString(16), '0x' + challengingBlockNum.toString(16), txBytes, challengingTx.proof, challengingTx.sig, { gasLimit: gas });
    };
    /**
     * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBetweenAsync = function (params) {
        var slot = params.slot, challengingBlockNum = params.challengingBlockNum, challengingTx = params.challengingTx, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var txBytes = challengingTx.rlpEncode();
        return this._plasmaContract.challengeBetween('0x' + slot.toString(16), '0x' + challengingBlockNum.toString(16), txBytes, challengingTx.proof, challengingTx.sig, { gasLimit: gas });
    };
    /**
     * `Invalid History Challenge`: Challenge a coin with invalid history.
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.challengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTx = params.challengingTx, challengingBlockNum = params.challengingBlockNum, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var challengingTxBytes = challengingTx.rlpEncode();
        var bond = ethers_1.ethers.utils.parseEther('0.1');
        return this._plasmaContract.challengeBefore('0x' + slot.toString(16), challengingTxBytes, challengingTx.proof, challengingTx.sig, '0x' + challengingBlockNum.toString(16), { value: bond, gasLimit: gas });
    };
    /**
     * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
     *
     * @returns Web3 tx receipt object.
     */
    EthereumPlasmaClient.prototype.respondChallengeBeforeAsync = function (params) {
        var slot = params.slot, challengingTxHash = params.challengingTxHash, respondingBlockNum = params.respondingBlockNum, respondingTx = params.respondingTx, from = params.from, gas = params.gas, gasPrice = params.gasPrice;
        var respondingTxBytes = respondingTx.rlpEncode();
        return this._plasmaContract.respondChallengeBefore('0x' + slot.toString(16), challengingTxHash, '0x' + respondingBlockNum.toString(16), respondingTxBytes, respondingTx.proof, respondingTx.sig, { gasLimit: gas });
    };
    EthereumPlasmaClient.prototype.marshalDepositEvent = function (log) {
        var decoded = this.plasmaCashContract.interface.parseLog(log).values;
        return {
            slot: helpers_1.hexBN(decoded.slot),
            blockNumber: helpers_1.hexBN(decoded.blockNumber),
            denomination: helpers_1.hexBN(decoded.denomination),
            from: decoded.from,
            contractAddress: decoded.contractAddress
        };
    };
    return EthereumPlasmaClient;
}());
exports.EthereumPlasmaClient = EthereumPlasmaClient;
//# sourceMappingURL=ethereum-client.js.map