"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
var __1 = require("..");
var helpers_1 = require("../helpers");
var ERC721 = require('./contracts/ERC721.json');
var ERC20 = require('./contracts/ERC20.json');
// Helper function to create a user instance.
// User friendly wrapper for all Entity related functions, taking advantage of the database
var User = /** @class */ (function (_super) {
    tslib_1.__extends(User, _super);
    function User(web3, params, startBlock) {
        var _this = _super.call(this, web3, params) || this;
        _this.buffers = {};
        _this._startBlock = startBlock;
        return _this;
    }
    Object.defineProperty(User, "contractName", {
        set: function (contractName) {
            User._contractName = contractName;
        },
        enumerable: true,
        configurable: true
    });
    User.createUser = function (web3Endpoint, plasmaAddress, dappchainEndpoint, ethPrivateKey, startBlock, chainId) {
        var provider = new web3_1.default.providers.WebsocketProvider(web3Endpoint);
        var web3 = new web3_1.default(provider);
        var database = new __1.PlasmaDB(web3Endpoint, dappchainEndpoint, plasmaAddress, ethPrivateKey);
        var ethAccount = web3.eth.accounts.privateKeyToAccount(ethPrivateKey);
        var ethPlasmaClient = new __1.EthereumPlasmaClient(web3, ethAccount, plasmaAddress);
        var writer = __1.createJSONRPCClient({ protocols: [{ url: dappchainEndpoint + '/rpc' }] });
        var reader = __1.createJSONRPCClient({ protocols: [{ url: dappchainEndpoint + '/query' }] });
        var dAppClient = new __1.Client(chainId || 'default', writer, reader);
        // TODO: Key should not be generated each time, user should provide their key, or it should be retrieved through some one way mapping
        var privKey = __1.CryptoUtils.generatePrivateKey();
        var pubKey = __1.CryptoUtils.publicKeyFromPrivateKey(privKey);
        dAppClient.txMiddleware = [
            new __1.NonceTxMiddleware(pubKey, dAppClient),
            new __1.SignedTxMiddleware(privKey)
        ];
        var callerAddress = new __1.Address(chainId || 'default', __1.LocalAddress.fromPublicKey(pubKey));
        var dAppPlasmaClient = new __1.DAppChainPlasmaClient({
            dAppClient: dAppClient,
            callerAddress: callerAddress,
            database: database,
            contractName: User._contractName
        });
        return new User(web3, {
            ethAccount: ethAccount,
            ethPlasmaClient: ethPlasmaClient,
            dAppPlasmaClient: dAppPlasmaClient,
            childBlockInterval: 1000
        }, startBlock);
    };
    User.prototype.depositETHAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentBlock, tx, coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.sendETH(this.plasmaCashContract._address, amount, 220000)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 3:
                        coin = _a.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 4:
                        currentBlock = _a.sent();
                        this.receiveAndWatchCoinAsync(coin.slot);
                        return [2 /*return*/, coin];
                }
            });
        });
    };
    User.prototype.depositERC721Async = function (uid, address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var token, currentBlock, tx, coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = new __1.SignedContract(this._web3, ERC721, address, this.ethAccount).instance;
                        return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, token.safeTransferFrom([
                                this.ethAccount.address,
                                this.plasmaCashContract._address,
                                uid.toString()
                            ])];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 3:
                        coin = _a.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 4:
                        currentBlock = _a.sent();
                        this.receiveAndWatchCoinAsync(coin.slot);
                        return [2 /*return*/, coin];
                }
            });
        });
    };
    User.prototype.depositERC20Async = function (amount, address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var token, currentApproval, _a, currentBlock, tx, coin;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        token = new __1.SignedContract(this._web3, ERC20, address, this.ethAccount).instance;
                        _a = bn_js_1.default.bind;
                        return [4 /*yield*/, token.allowance(this.ethAccount.address, this.plasmaCashContract._address)];
                    case 1:
                        currentApproval = new (_a.apply(bn_js_1.default, [void 0, _b.sent()]))();
                        if (!amount.gt(currentApproval)) return [3 /*break*/, 3];
                        return [4 /*yield*/, token.approve([
                                this.plasmaCashContract._address,
                                amount.sub(currentApproval).toString()
                            ])];
                    case 2:
                        _b.sent();
                        console.log('Approved an extra', amount.sub(currentApproval));
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 4:
                        currentBlock = _b.sent();
                        return [4 /*yield*/, this.plasmaCashContract.depositERC20([amount.toString(), address])];
                    case 5:
                        tx = _b.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 6:
                        coin = _b.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 7:
                        currentBlock = _b.sent();
                        this.receiveAndWatchCoinAsync(coin.slot);
                        return [2 /*return*/, coin];
                }
            });
        });
    };
    // Buffer is how many blocks the client will wait for the tx to get confirmed
    User.prototype.transferAndVerifyAsync = function (slot, newOwner, buffer) {
        if (buffer === void 0) { buffer = 6; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var watcher, _a, _b, _c;
            var _this = this;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.transferAsync(slot, newOwner)];
                    case 1:
                        _d.sent();
                        _b = (_a = this.plasmaCashContract.events).SubmittedBlock;
                        _c = {
                            filter: {}
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 2:
                        watcher = _b.apply(_a, [(_c.fromBlock = _d.sent(),
                                _c)])
                            .on('data', function (event, err) {
                            if (_this.verifyInclusionAsync(slot, new bn_js_1.default(event.returnValues.blockNumber))) {
                                console.log(_this.prefix(slot) + " Tx included & verified in block " + event.returnValues.blockNumber);
                                _this.stopWatching(slot);
                                watcher.unsubscribe();
                                _this.buffers[slot.toString()] = 0;
                            }
                            if (_this.buffers[slot.toString()]++ == buffer) {
                                watcher.unsubscribe();
                                _this.buffers[slot.toString()] = 0;
                                throw new Error(_this.prefix(slot) + " Tx was censored for " + buffer + " blocks.");
                            }
                        })
                            .on('error', function (err) { return console.log(err); });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Transfer a coin by specifying slot & new owner
    User.prototype.transferAsync = function (slot, newOwner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, prevBlockNum, blockNum;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findBlocks(slot)];
                    case 1:
                        _a = _b.sent(), prevBlockNum = _a.prevBlockNum, blockNum = _a.blockNum;
                        return [4 /*yield*/, this.transferTokenAsync({
                                slot: slot,
                                prevBlockNum: blockNum,
                                denomination: 1,
                                newOwner: newOwner
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.getCurrentBlockAsync()];
                }
            });
        });
    };
    // Whenever a new block gets submitted refresh the user's state for their coins
    User.prototype.watchBlocks = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            var _this = this;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = this.plasmaCashContract.events).SubmittedBlock;
                        _d = {
                            filter: {}
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 1:
                        _a.newBlocks = _c.apply(_b, [(_d.fromBlock = _e.sent(),
                                _d)])
                            .on('data', function (event, err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var blk, coins, localCoins, _a, _b, _i, i, coin, exists, j;
                            return tslib_1.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        blk = new bn_js_1.default(event.returnValues.blockNumber);
                                        console.log("Got new block: " + blk);
                                        return [4 /*yield*/, this.getUserCoinsAsync()
                                            // For each coin he already had, just get the history
                                        ];
                                    case 1:
                                        coins = _c.sent();
                                        return [4 /*yield*/, this.database.getAllCoinSlots()];
                                    case 2:
                                        localCoins = _c.sent();
                                        _a = [];
                                        for (_b in coins)
                                            _a.push(_b);
                                        _i = 0;
                                        _c.label = 3;
                                    case 3:
                                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                                        i = _a[_i];
                                        coin = coins[i];
                                        exists = false;
                                        for (j in localCoins) {
                                            if (coin.slot.eq(localCoins[j]))
                                                exists = true;
                                        }
                                        if (!exists) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.getPlasmaTxAsync(coin.slot, blk)]; // this will add the coin to state
                                    case 4:
                                        _c.sent(); // this will add the coin to state
                                        return [3 /*break*/, 6];
                                    case 5:
                                        this.receiveAndWatchCoinAsync(coin.slot);
                                        _c.label = 6;
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })
                            .on('error', function (err) { return console.log(err); });
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.stopWatchingBlocks = function () {
        this.newBlocks.unsubscribe();
        delete this.newBlocks;
    };
    // Receives a coin, checks if it's valid, and if it is checks if there's an exit pending for it e
    User.prototype.receiveAndWatchCoinAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var valid, events, exit, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.receiveCoinAsync(slot)];
                    case 1:
                        valid = _d.sent();
                        if (!valid) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.plasmaCashContract.getPastEvents('StartedExit', {
                                filter: { slot: slot.toString() },
                                fromBlock: this._startBlock
                            })];
                    case 2:
                        events = _d.sent();
                        if (!(events.length > 0)) return [3 /*break*/, 4];
                        exit = events[events.length - 1];
                        return [4 /*yield*/, this.challengeExitAsync(slot, exit.owner)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _a = this.watchExit;
                        _b = [slot];
                        _c = bn_js_1.default.bind;
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 5:
                        _a.apply(this, _b.concat([new (_c.apply(bn_js_1.default, [void 0, _d.sent()]))()]));
                        console.log(this.prefix(slot) + " Verified history, started watching.");
                        return [3 /*break*/, 7];
                    case 6:
                        this.database.removeCoin(slot);
                        console.log(this.prefix(slot) + " Invalid history, rejecting...");
                        _d.label = 7;
                    case 7: return [2 /*return*/, valid];
                }
            });
        });
    };
    // Called whenever the user receives a coin.
    User.prototype.receiveCoinAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coin, valid, blocks;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPlasmaCoinAsync(slot)];
                    case 1:
                        coin = _a.sent();
                        return [4 /*yield*/, this.checkHistoryAsync(coin)];
                    case 2:
                        valid = _a.sent();
                        return [4 /*yield*/, this.getBlockNumbersAsync(coin.depositBlockNum)];
                    case 3:
                        blocks = _a.sent();
                        this.database.saveBlock(coin.slot, blocks[blocks.length - 1]);
                        return [2 /*return*/, valid];
                }
            });
        });
    };
    User.prototype.verifyInclusionAsync = function (slot, block) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx, root;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPlasmaTxAsync(slot, block)]; // get the block number from the proof of inclusion and get the tx from that
                    case 1:
                        tx = _a.sent() // get the block number from the proof of inclusion and get the tx from that
                        ;
                        return [4 /*yield*/, this.getBlockRootAsync(block)];
                    case 2:
                        root = _a.sent();
                        return [2 /*return*/, this.checkInclusionAsync(tx, root, slot, tx.proof)];
                }
            });
        });
    };
    // Exiting a coin by specifying the slot. Finding the block numbers is done under the hood.
    // Stop watching for exits once the event is mined
    User.prototype.exitAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, prevBlockNum, blockNum;
            var _this = this;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        // Once the exit is started, stop watching for exit events
                        _b = (_a = this.plasmaCashContract).once;
                        _c = ['StartedExit'];
                        _d = {
                            filter: { slot: slot.toString() }
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 1:
                        // Once the exit is started, stop watching for exit events
                        _b.apply(_a, _c.concat([(_d.fromBlock = _k.sent(),
                                _d), function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            // Stop watching for exit events
                                            this.stopWatching(slot);
                                            // Start watching challenge events
                                            _a = this.watchChallenge;
                                            _b = [slot];
                                            _c = bn_js_1.default.bind;
                                            return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                                        case 1:
                                            // Start watching challenge events
                                            _a.apply(this, _b.concat([new (_c.apply(bn_js_1.default, [void 0, _d.sent()]))()]));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }]));
                        // Once the exit has been finalized, stop watching for challenge events
                        _f = (_e = this.plasmaCashContract).once;
                        _g = ['FinalizedExit'];
                        _h = {
                            filter: { slot: slot.toString() }
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 2:
                        // Once the exit has been finalized, stop watching for challenge events
                        _f.apply(_e, _g.concat([(_h.fromBlock = _k.sent(),
                                _h), function () { return _this.stopWatching(slot); }]));
                        return [4 /*yield*/, this.findBlocks(slot)];
                    case 3:
                        _j = _k.sent(), prevBlockNum = _j.prevBlockNum, blockNum = _j.blockNum;
                        return [4 /*yield*/, this.startExitAsync({
                                slot: slot,
                                prevBlockNum: prevBlockNum,
                                exitBlockNum: blockNum
                            })];
                    case 4:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Get all deposits, filtered by the user's address.
    User.prototype.deposits = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _deposits, coins;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDepositEvents(this._startBlock || new bn_js_1.default(0), false)];
                    case 1:
                        _deposits = _a.sent();
                        coins = _deposits.map(function (d) { return _this.getPlasmaCoinAsync(d.slot); });
                        return [4 /*yield*/, Promise.all(coins)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.allDeposits = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _deposits, coins;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDepositEvents(this._startBlock || new bn_js_1.default(0), true)];
                    case 1:
                        _deposits = _a.sent();
                        coins = _deposits.map(function (d) { return _this.getPlasmaCoinAsync(d.slot); });
                        return [4 /*yield*/, Promise.all(coins)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.prototype.disconnect = function () {
        // @ts-ignore
        this.web3.currentProvider.connection.close();
    };
    User.prototype.debug = function (i) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var deps;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allDeposits()];
                    case 1:
                        deps = _a.sent();
                        return [4 /*yield*/, this.submitPlasmaDepositAsync(deps[i])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.findBlocks = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coinData, lastUserBlock, blockNum, prevBlockNum, i, coin, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCoinHistoryFromDBAsync(slot)];
                    case 1:
                        coinData = _a.sent();
                        lastUserBlock = this.database.getBlock(slot);
                        if (!(lastUserBlock === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 2:
                        lastUserBlock = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 4, , 6]);
                        blockNum = coinData[0].blockNumber;
                        prevBlockNum = coinData[0].tx.prevBlockNum;
                        for (i = 1; i < coinData.length; i++) {
                            coin = coinData[i];
                            if (!coin.included)
                                continue; // skip exclusion proofs
                            if (lastUserBlock.lt(coin.blockNumber)) {
                                // in case the malicious operator includes invalid/double spends,
                                // we want to get the last legitimate state, so we stop iterating
                                break;
                            }
                            if (coin.blockNumber.gt(blockNum)) {
                                blockNum = coin.blockNumber;
                                prevBlockNum = coin.tx.prevBlockNum;
                            }
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        // If no coindata is available in the database, then that's a new coin
                        prevBlockNum = new bn_js_1.default(0);
                        return [4 /*yield*/, this.getPlasmaCoinAsync(slot)];
                    case 5:
                        blockNum = (_a.sent()).depositBlockNum;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, { prevBlockNum: prevBlockNum, blockNum: blockNum }];
                }
            });
        });
    };
    User.prototype.getCoinHistoryFromDBAsync = function (slot) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPlasmaCoinAsync(slot)
                        // Update the local database
                    ];
                    case 1:
                        coin = _a.sent();
                        // Update the local database
                        return [4 /*yield*/, this.checkHistoryAsync(coin)];
                    case 2:
                        // Update the local database
                        _a.sent();
                        return [2 /*return*/, this.database.getCoin(slot)];
                }
            });
        });
    };
    User.prototype.pollForBlockChange = function (currentBlock, maxIters, sleepTime) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blk, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        blk = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < maxIters)) return [3 /*break*/, 6];
                        return [4 /*yield*/, helpers_1.sleep(sleepTime)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 4:
                        blk = _a.sent();
                        if (blk.gt(currentBlock)) {
                            return [2 /*return*/, blk];
                        }
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: throw new Error("Exceeded max iterations while waiting for the next block after " + currentBlock);
                }
            });
        });
    };
    return User;
}(__1.Entity));
exports.User = User;
//# sourceMappingURL=user.js.map