"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var ethereum_client_1 = require("./ethereum-client");
var address_1 = require("../address");
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var solidity_helpers_1 = require("../solidity-helpers");
var Plasma = require('./contracts/plasma-cash-abi.json');
var abiDecoder = require('abi-decoder'); // NodeJS
abiDecoder.addABI(Plasma);
var helpers_1 = require("../helpers");
var debugLog = debug_1.default('plasma-cash:entity');
var errorLog = debug_1.default('plasma-cash:entity:error');
// TODO: Maybe come up with a better name?
/**
 * Manages Plasma Cash related interactions between an Ethereum network (Ganache, Mainnet, etc.)
 * and a Loom DAppChain from the point of view of a single entity. An entity has two identities, one
 * on Ethereum, and one on the DAppChain, each identity has its own private/public key pair.
 */
var Entity = /** @class */ (function () {
    function Entity(ethers, params) {
        this._ethers = ethers;
        this._ethPlasmaClient = params.ethPlasmaClient;
        this._dAppPlasmaClient = params.dAppPlasmaClient;
        this._defaultGas = params.defaultGas;
        this._childBlockInterval = params.childBlockInterval;
        this._exitWatchers = {};
        this._challengeWatchers = {};
        this._ethAddress = params.defaultAccount;
    }
    Object.defineProperty(Entity.prototype, "ethers", {
        get: function () {
            return this._ethers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "web3", {
        get: function () {
            return this._ethPlasmaClient.web3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "database", {
        get: function () {
            return this._dAppPlasmaClient.database;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "ethAddress", {
        get: function () {
            return this._ethAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "plasmaEvents", {
        get: function () {
            return this._ethPlasmaClient.plasmaEvents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "plasmaCashContract", {
        get: function () {
            return this._ethPlasmaClient.plasmaCashContract;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "contractName", {
        get: function () {
            return this._dAppPlasmaClient.contractName;
        },
        enumerable: true,
        configurable: true
    });
    // This should be called whenever a new block gets received
    Entity.prototype.refreshAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coins, _a, _b, _c, i, coin;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = Array).from;
                        _c = Set.bind;
                        return [4 /*yield*/, this.getUserCoinsAsync()];
                    case 1:
                        coins = _b.apply(_a, [new (_c.apply(Set, [void 0, _d.sent()]))()]);
                        i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(i < coins.length)) return [3 /*break*/, 5];
                        coin = coins[i];
                        // Skip any coins that have been exited
                        if (coin.contractAddress === '0x0000000000000000000000000000000000000000')
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkHistoryAsync(coin)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.checkHistoryAsync = function (coin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blocks, proofs, valid;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockNumbersAsync(coin.depositBlockNum)];
                    case 1:
                        blocks = _a.sent();
                        return [4 /*yield*/, this.getCoinHistoryAsync(coin.slot, blocks)]; // this will add the coin to state
                    case 2:
                        proofs = _a.sent() // this will add the coin to state
                        ;
                        return [4 /*yield*/, this.verifyCoinHistoryAsync(coin.slot, proofs)];
                    case 3:
                        valid = _a.sent();
                        return [2 /*return*/, valid];
                }
            });
        });
    };
    Entity.prototype.transferTokenAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, prevBlockNum, denomination, newOwner, tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, prevBlockNum = params.prevBlockNum, denomination = params.denomination, newOwner = params.newOwner;
                        tx = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: prevBlockNum,
                            denomination: denomination,
                            newOwner: newOwner,
                            prevOwner: this.ethAddress
                        });
                        return [4 /*yield*/, tx.signAsync(new solidity_helpers_1.EthersSigner(this._ethers))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._dAppPlasmaClient.sendTxAsync(tx)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.getPlasmaTxAsync = function (slot, blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var root, tx, included;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockRootAsync(blockNumber)];
                    case 1:
                        root = _a.sent();
                        if (!this.database.exists(slot, blockNumber)) return [3 /*break*/, 2];
                        tx = this.database.getTx(slot, blockNumber);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._dAppPlasmaClient.getPlasmaTxAsync(slot, blockNumber)];
                    case 3:
                        tx = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.checkInclusionAsync(tx, root, slot, tx.proof)];
                    case 5:
                        included = _a.sent();
                        this._dAppPlasmaClient.database.receiveCoin(slot, blockNumber, included, tx);
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    Entity.prototype.getExitAsync = function (slot) {
        return this._ethPlasmaClient.getExitAsync({ slot: slot, from: this.ethAddress });
    };
    Entity.prototype.getCurrentBlockAsync = function () {
        return this._dAppPlasmaClient.getCurrentPlasmaBlockNumAsync();
    };
    Entity.prototype.getPlasmaCoinAsync = function (slot) {
        return this._ethPlasmaClient.getPlasmaCoinAsync({ slot: slot, from: this.ethAddress });
    };
    Entity.prototype.getBlockRootAsync = function (blockNumber) {
        return this._ethPlasmaClient.getBlockRootAsync({ blockNumber: blockNumber, from: this.ethAddress });
    };
    Entity.prototype.getUserCoinsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var addr, slots, coins;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = new address_1.Address('eth', address_1.LocalAddress.fromHexString(this.ethAddress));
                        return [4 /*yield*/, this._dAppPlasmaClient.getUserSlotsAsync(addr)];
                    case 1:
                        slots = _a.sent();
                        coins = slots.map(function (s) { return _this.getPlasmaCoinAsync(s); });
                        return [4 /*yield*/, Promise.all(coins)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Entity.prototype.checkMembershipAsync = function (leaf, root, slot, proof) {
        return this._ethPlasmaClient.checkMembershipAsync({
            leaf: leaf,
            root: root,
            slot: slot,
            proof: proof,
            from: this.ethAddress
        });
    };
    Entity.prototype.startExitAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, prevBlockNum, exitBlockNum, exitTx_1, exitTx, prevTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, prevBlockNum = params.prevBlockNum, exitBlockNum = params.exitBlockNum;
                        if (!(exitBlockNum.modn(this._childBlockInterval) !== 0)) return [3 /*break*/, 2];
                        exitTx_1 = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: new bn_js_1.default(0),
                            denomination: 1,
                            newOwner: this.ethAddress
                        });
                        return [4 /*yield*/, exitTx_1.signAsync(new solidity_helpers_1.EthersSigner(this._ethers))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._ethPlasmaClient.startExitAsync({
                                slot: slot,
                                exitTx: exitTx_1,
                                exitBlockNum: exitBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                    case 2: return [4 /*yield*/, this.getPlasmaTxAsync(slot, exitBlockNum)];
                    case 3:
                        exitTx = _a.sent();
                        if (!exitTx) {
                            throw new Error(this.prefix(slot) + " Invalid exit block: missing tx");
                        }
                        return [4 /*yield*/, this.getPlasmaTxAsync(slot, prevBlockNum)];
                    case 4:
                        prevTx = _a.sent();
                        if (!prevTx) {
                            throw new Error(this.prefix(slot) + " Invalid prev block: missing tx");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.startExitAsync({
                                slot: slot,
                                prevTx: prevTx,
                                exitTx: exitTx,
                                prevBlockNum: prevBlockNum,
                                exitBlockNum: exitBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.cancelExitsAsync = function (slots) {
        return this._ethPlasmaClient.cancelExitsAsync({
            slots: slots,
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.cancelExitAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._ethPlasmaClient.cancelExitAsync({
                        slot: slot,
                        from: this.ethAddress,
                        gas: this._defaultGas
                    })];
            });
        });
    };
    Entity.prototype.finalizeExitsAsync = function (slots) {
        return this._ethPlasmaClient.finalizeExitsAsync({
            slots: slots,
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.finalizeExitAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethPlasmaClient.finalizeExitAsync({
                            slot: slot,
                            from: this.ethAddress,
                            gas: this._defaultGas
                        })];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    /**
     * @return Web3 subscription object that can be passed to stopWatching().
     */
    Entity.prototype.watchExit = function (slot, fromBlock) {
        var _this = this;
        debugLog(this.prefix(slot) + " Started watching exits");
        if (this._exitWatchers[slot.toString()] !== undefined) {
            // replace old filter for that coin
            this._exitWatchers[slot.toString()].unsubscribe();
        }
        this._exitWatchers[slot.toString()] = this.plasmaEvents.events
            .StartedExit({
            filter: { slot: slot.toString() },
            fromBlock: fromBlock
        })
            .on('data', function (event, err) {
            _this.challengeExitAsync(slot, event.returnValues.owner);
        })
            .on('error', function (err) { return errorLog(err); });
        return this._exitWatchers[slot.toString()];
    };
    /**
     * @return Web3 subscription object that can be passed to stopWatching().
     */
    Entity.prototype.watchChallenge = function (slot, fromBlock) {
        var _this = this;
        debugLog(this.prefix(slot) + " Started watching challenges");
        if (this._challengeWatchers[slot.toString()] !== undefined) {
            // replace old filter for that coin
            this._challengeWatchers[slot.toString()].unsubscribe();
        }
        this._challengeWatchers[slot.toString()] = this.plasmaEvents.events
            .ChallengedExit({
            filter: { slot: slot.toString() },
            fromBlock: fromBlock
        })
            .on('data', function (event, err) {
            _this.respondChallengeAsync(slot, event.returnValues.txHash, event.returnValues.challengingBlockNumber);
        })
            .on('error', function (err) { return errorLog(err); });
        return this._challengeWatchers[slot.toString()];
    };
    Entity.prototype.challengeExitAsync = function (slot, owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exit, coin, blocks, proofs, _a, _b, _i, i, blk, tx, tx, tx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getExitAsync(slot)];
                    case 1:
                        exit = _c.sent();
                        if (exit.exitBlock.eq(new bn_js_1.default(0)))
                            return [2 /*return*/];
                        if (owner === this.ethAddress) {
                            debugLog(this.prefix(slot) + " Valid exit!");
                            return [2 /*return*/];
                        }
                        else {
                            debugLog(this.prefix(slot) + " Challenging exit!");
                        }
                        return [4 /*yield*/, this.getPlasmaCoinAsync(slot)];
                    case 2:
                        coin = _c.sent();
                        return [4 /*yield*/, this.getBlockNumbersAsync(coin.depositBlockNum)];
                    case 3:
                        blocks = _c.sent();
                        return [4 /*yield*/, this.getCoinHistoryAsync(slot, blocks)];
                    case 4:
                        proofs = _c.sent();
                        _a = [];
                        for (_b in blocks)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 15];
                        i = _a[_i];
                        blk = blocks[i];
                        if (!(blk.toString() in proofs.inclusion)) {
                            return [3 /*break*/, 14];
                        }
                        if (!blk.gt(exit.exitBlock)) return [3 /*break*/, 8];
                        debugLog(this.prefix(slot) + " Challenge Spent Coin with " + blk + "!");
                        return [4 /*yield*/, this.challengeAfterAsync({ slot: slot, challengingBlockNum: blk })];
                    case 6:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 8:
                        if (!(exit.prevBlock.lt(blk) && blk.lt(exit.exitBlock))) return [3 /*break*/, 11];
                        debugLog(this.prefix(slot) + " Challenge Double Spend with " + blk + "!");
                        return [4 /*yield*/, this.challengeBetweenAsync({ slot: slot, challengingBlockNum: blk })];
                    case 9:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 11:
                        if (!blk.lt(exit.prevBlock)) return [3 /*break*/, 14];
                        debugLog(this.prefix(slot) + " Challenge Invalid History! with " + blk);
                        return [4 /*yield*/, this.challengeBeforeAsync({
                                slot: slot,
                                challengingBlockNum: blk
                            })];
                    case 12:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 13:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        _i++;
                        return [3 /*break*/, 5];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.respondChallengeAsync = function (slot, txHash, challengingBlockNum) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coin, blocks, proofs, _a, _b, _i, i, blk, tx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPlasmaCoinAsync(slot)];
                    case 1:
                        coin = _c.sent();
                        return [4 /*yield*/, this.getBlockNumbersAsync(coin.depositBlockNum)
                            // We challenge with the block that includes a transaction right after the challenging block
                        ];
                    case 2:
                        blocks = _c.sent();
                        return [4 /*yield*/, this.getCoinHistoryAsync(slot, blocks)];
                    case 3:
                        proofs = _c.sent();
                        _a = [];
                        for (_b in blocks)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        i = _a[_i];
                        blk = blocks[i];
                        // check only inclusion blocks
                        if (!(blk.toString() in proofs.inclusion)) {
                            return [3 /*break*/, 7];
                        }
                        if (!blk.gt(new bn_js_1.default(challengingBlockNum))) return [3 /*break*/, 7];
                        debugLog(this.prefix(slot) + " Responding with " + blk + "!");
                        return [4 /*yield*/, this.respondChallengeBeforeAsync({
                                slot: slot,
                                challengingTxHash: txHash,
                                respondingBlockNum: blk
                            })];
                    case 5:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.getCoinHistoryAsync = function (slot, blockNumbers) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var inclProofs, exclProofs, txs, _a, _b, _i, i, blockNumber, root, tx, included;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        inclProofs = {};
                        exclProofs = {};
                        txs = {};
                        _a = [];
                        for (_b in blockNumbers)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        i = _a[_i];
                        blockNumber = blockNumbers[i];
                        return [4 /*yield*/, this.getBlockRootAsync(blockNumber)];
                    case 2:
                        root = _c.sent();
                        return [4 /*yield*/, this.getPlasmaTxAsync(slot, blockNumber)];
                    case 3:
                        tx = _c.sent();
                        txs[blockNumber.toString()] = tx;
                        return [4 /*yield*/, this.checkInclusionAsync(tx, root, slot, tx.proof)];
                    case 4:
                        included = _c.sent();
                        if (included) {
                            inclProofs[blockNumber.toString()] = tx.proof;
                        }
                        else {
                            exclProofs[blockNumber.toString()] = tx.proof;
                        }
                        this._dAppPlasmaClient.database.receiveCoin(slot, blockNumber, included, tx);
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, {
                            exclusion: exclProofs,
                            inclusion: inclProofs,
                            transactions: txs
                        }];
                }
            });
        });
    };
    Entity.prototype.verifyCoinHistoryAsync = function (slot, proofs) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coin, earliestValidBlock, _a, _b, _i, p, blockNumber, tx, root, included, _c, _d, _e, p, blockNumber, root, excluded;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.getPlasmaCoinAsync(slot)];
                    case 1:
                        coin = _f.sent();
                        earliestValidBlock = coin.depositBlockNum;
                        _a = [];
                        for (_b in proofs.inclusion)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        p = _a[_i];
                        blockNumber = new bn_js_1.default(p);
                        tx = proofs.transactions[p] // get the block number from the proof of inclusion and get the tx from that
                        ;
                        return [4 /*yield*/, this.getBlockRootAsync(blockNumber)];
                    case 3:
                        root = _f.sent();
                        return [4 /*yield*/, this.checkInclusionAsync(tx, root, slot, proofs.inclusion[p])];
                    case 4:
                        included = _f.sent();
                        if (included) {
                            // Skip deposit blocks
                            if (tx.prevBlockNum.eq(new bn_js_1.default(0))) {
                                return [3 /*break*/, 5];
                            }
                            if (tx.prevBlockNum.eq(earliestValidBlock)) {
                                earliestValidBlock = blockNumber;
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                        }
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        _c = [];
                        for (_d in proofs.exclusion)
                            _c.push(_d);
                        _e = 0;
                        _f.label = 7;
                    case 7:
                        if (!(_e < _c.length)) return [3 /*break*/, 11];
                        p = _c[_e];
                        blockNumber = new bn_js_1.default(p);
                        return [4 /*yield*/, this.getBlockRootAsync(blockNumber)];
                    case 8:
                        root = _f.sent();
                        return [4 /*yield*/, this.checkExclusionAsync(root, slot, proofs.exclusion[p])];
                    case 9:
                        excluded = _f.sent();
                        if (!excluded) {
                            return [2 /*return*/, false];
                        }
                        _f.label = 10;
                    case 10:
                        _e++;
                        return [3 /*break*/, 7];
                    case 11: return [2 /*return*/, true];
                }
            });
        });
    };
    Entity.prototype.checkExclusionAsync = function (root, slot, proof) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var emptyHash, ret;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emptyHash = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';
                        return [4 /*yield*/, this.checkMembershipAsync(emptyHash, root, slot, proof)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    Entity.prototype.checkInclusionAsync = function (tx, root, slot, proof) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ret;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tx.prevBlockNum.eq(new bn_js_1.default(0))) return [3 /*break*/, 1];
                        ret = tx.hash === root;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.checkMembershipAsync(tx.hash, root, slot, proof)];
                    case 2:
                        ret = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, ret];
                }
            });
        });
    };
    Entity.prototype.getDepositEvents = function (fromBlock, all) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filter, events, deposits;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = !all ? { from: this.ethAddress } : {};
                        return [4 /*yield*/, this.plasmaEvents.getPastEvents('Deposit', {
                                filter: filter,
                                fromBlock: fromBlock ? fromBlock : 0
                            })];
                    case 1:
                        events = _a.sent();
                        deposits = events.map(function (e) { return ethereum_client_1.marshalDepositEvent(e.returnValues); });
                        return [2 /*return*/, deposits];
                }
            });
        });
    };
    Entity.prototype.getBlockNumbersAsync = function (startBlock) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var endBlock, blockNumbers, nextBlk, interval, i, ret;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        endBlock = _a.sent();
                        blockNumbers = [];
                        if (startBlock.eq(endBlock)) {
                            return [2 /*return*/, [startBlock]];
                        }
                        nextBlk = this.nextNonDepositBlock(startBlock);
                        if (nextBlk.lte(endBlock)) {
                            interval = new bn_js_1.default(this._childBlockInterval);
                            for (i = nextBlk; i.lte(endBlock); i = i.add(interval)) {
                                blockNumbers.push(i);
                            }
                        }
                        if (startBlock.eq(nextBlk)) {
                            ret = blockNumbers;
                        }
                        else {
                            ret = [startBlock].concat(blockNumbers);
                        }
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    Entity.prototype.nextNonDepositBlock = function (startBlock) {
        return new bn_js_1.default(Math.ceil(startBlock / this._childBlockInterval) * this._childBlockInterval);
    };
    Entity.prototype.stopWatching = function (slot) {
        if (this._exitWatchers[slot.toString()]) {
            debugLog(this.prefix(slot) + " Stopped watching exits");
            this._exitWatchers[slot.toString()].unsubscribe();
            delete this._exitWatchers[slot.toString()];
        }
        if (this._challengeWatchers[slot.toString()]) {
            debugLog(this.prefix(slot) + " Stopped watching challenges");
            this._challengeWatchers[slot.toString()].unsubscribe();
            delete this._challengeWatchers[slot.toString()];
        }
    };
    Entity.prototype.withdrawAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ethPlasmaClient.withdrawAsync({
                            slot: slot,
                            from: this.ethAddress,
                            gas: this._defaultGas
                        })];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 2:
                        _a.sent();
                        this.database.removeCoin(slot); // remove the coin from the state
                        return [2 /*return*/];
                }
            });
        });
    };
    Entity.prototype.withdrawBondsAsync = function () {
        return this._ethPlasmaClient.withdrawBondsAsync({
            from: this.ethAddress,
            gas: this._defaultGas
        });
    };
    Entity.prototype.challengeAfterAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, challengingBlockNum, challengingTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingBlockNum = params.challengingBlockNum;
                        return [4 /*yield*/, this.getPlasmaTxAsync(slot, challengingBlockNum)];
                    case 1:
                        challengingTx = _a.sent();
                        if (!challengingTx) {
                            throw new Error(this.prefix(slot) + " Invalid challenging block: missing tx");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeAfterAsync({
                                slot: slot,
                                challengingBlockNum: challengingBlockNum,
                                challengingTx: challengingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.challengeBetweenAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, challengingBlockNum, challengingTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingBlockNum = params.challengingBlockNum;
                        return [4 /*yield*/, this.getPlasmaTxAsync(slot, challengingBlockNum)];
                    case 1:
                        challengingTx = _a.sent();
                        if (!challengingTx) {
                            throw new Error(this.prefix(slot) + " Invalid challenging block: missing tx");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeBetweenAsync({
                                slot: slot,
                                challengingBlockNum: challengingBlockNum,
                                challengingTx: challengingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.challengeBeforeAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, challengingBlockNum, challengingTx_1, challengingTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingBlockNum = params.challengingBlockNum;
                        if (!(challengingBlockNum.modn(this._childBlockInterval) !== 0)) return [3 /*break*/, 2];
                        challengingTx_1 = new plasma_cash_tx_1.PlasmaCashTx({
                            slot: slot,
                            prevBlockNum: new bn_js_1.default(0),
                            denomination: 1,
                            newOwner: this.ethAddress
                        });
                        return [4 /*yield*/, challengingTx_1.signAsync(new solidity_helpers_1.EthersSigner(this._ethers))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._ethPlasmaClient.challengeBeforeAsync({
                                slot: slot,
                                challengingTx: challengingTx_1,
                                challengingBlockNum: challengingBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                    case 2: return [4 /*yield*/, this.getPlasmaTxAsync(slot, challengingBlockNum)];
                    case 3:
                        challengingTx = _a.sent();
                        if (!challengingTx) {
                            throw new Error(this.prefix(slot) + " Invalid exit block: missing tx");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.challengeBeforeAsync({
                                slot: slot,
                                challengingTx: challengingTx,
                                challengingBlockNum: challengingBlockNum,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    Entity.prototype.respondChallengeBeforeAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var slot, challengingTxHash, respondingBlockNum, respondingTx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slot = params.slot, challengingTxHash = params.challengingTxHash, respondingBlockNum = params.respondingBlockNum;
                        return [4 /*yield*/, this.getPlasmaTxAsync(slot, respondingBlockNum)];
                    case 1:
                        respondingTx = _a.sent();
                        if (!respondingTx) {
                            throw new Error(this.prefix(slot) + " Invalid responding block: missing tx");
                        }
                        return [2 /*return*/, this._ethPlasmaClient.respondChallengeBeforeAsync({
                                slot: slot,
                                challengingTxHash: challengingTxHash,
                                respondingBlockNum: respondingBlockNum,
                                respondingTx: respondingTx,
                                from: this.ethAddress,
                                gas: this._defaultGas
                            })];
                }
            });
        });
    };
    /**
     * Retrieves the Plasma coin created by a deposit tx.
     * Throws an error if the given tx receipt doesn't contain a Plasma deposit event.
     *
     * @param tx The transaction that we want to decode.
     */
    Entity.prototype.getCoinFromTxAsync = function (tx) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _tx, logs, depositLog, coinId;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tx.wait()];
                    case 1:
                        _tx = _a.sent();
                        if (_tx.logs === undefined) {
                            throw Error('No logs were found');
                        }
                        logs = _tx.logs.map(function (l) { return _this.plasmaCashContract.interface.parseLog(l); });
                        depositLog = logs.find(function (l) { return l !== null && l.name === 'Deposit'; });
                        if (depositLog === undefined) {
                            throw Error('No deposit event found');
                        }
                        coinId = helpers_1.hexBN(depositLog.values.slot);
                        return [2 /*return*/, this.getPlasmaCoinAsync(coinId)];
                }
            });
        });
    };
    Entity.prototype.prefix = function (slot) {
        return "[" + this.ethAddress + ", " + slot.toString(16) + "]";
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map