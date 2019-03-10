"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var ethers_1 = require("ethers");
var __1 = require("..");
var helpers_1 = require("../helpers");
var address_mapper_1 = require("../contracts/address-mapper");
var solidity_helpers_1 = require("../solidity-helpers");
var debugLog = debug_1.default('plasma-cash:user');
var errorLog = debug_1.default('plasma-cash:user:error');
var ERC721_ABI = ['function safeTransferFrom(address from, address to, uint256 tokenId) public'];
var ERC20_ABI = [
    'function approve(address spender, uint256 value) public returns (bool)',
    'function allowance(address owner, address spender) public view returns (uint256)'
];
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
    User.createMetamaskUser = function (web3, dappchainPrivateKey, plasmaAddress, dappchainEndpoint, eventsEndpoint, startBlock, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, signer;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                signer = provider.getSigner();
                return [2 /*return*/, this.createUser(signer, dappchainPrivateKey, plasmaAddress, dappchainEndpoint, eventsEndpoint, undefined, startBlock, chainId)];
            });
        });
    };
    User.createOfflineUser = function (privateKey, dappchainPrivateKey, endpoint, plasmaAddress, dappchainEndpoint, eventsEndpoint, dbPath, startBlock, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, this.createUser(wallet, dappchainPrivateKey, plasmaAddress, dappchainEndpoint, eventsEndpoint, dbPath, startBlock, chainId)];
            });
        });
    };
    User.createUser = function (wallet, dappchainPrivateKey, plasmaAddress, dappchainEndpoint, eventsEndpoint, dbPath, startBlock, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, dAppClient, pubKey, callerAddress, database, ethPlasmaClient, addressMapper, ethAddress, _b, _c, _d, _e, dAppPlasmaClient, defaultAccount;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = helpers_1.createDefaultClient(dappchainPrivateKey || __1.CryptoUtils.Uint8ArrayToB64(__1.CryptoUtils.generatePrivateKey()), dappchainEndpoint, chainId || 'default'), dAppClient = _a.client, pubKey = _a.publicKey, callerAddress = _a.address;
                        database = new __1.PlasmaDB(dbPath);
                        ethPlasmaClient = new __1.EthereumPlasmaClient(wallet, plasmaAddress, eventsEndpoint);
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(dAppClient, new __1.Address(dAppClient.chainId, __1.LocalAddress.fromPublicKey(pubKey)))];
                    case 1:
                        addressMapper = _f.sent();
                        _b = __1.Address.bind;
                        _c = [void 0, 'eth'];
                        _e = (_d = __1.LocalAddress).fromHexString;
                        return [4 /*yield*/, wallet.getAddress()];
                    case 2:
                        ethAddress = new (_b.apply(__1.Address, _c.concat([_e.apply(_d, [_f.sent()])])))();
                        return [4 /*yield*/, addressMapper.hasMappingAsync(ethAddress)];
                    case 3:
                        if (!!(_f.sent())) return [3 /*break*/, 5];
                        // Register our address if it's not found
                        return [4 /*yield*/, addressMapper.addIdentityMappingAsync(ethAddress, callerAddress, new solidity_helpers_1.EthersSigner(wallet))];
                    case 4:
                        // Register our address if it's not found
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        dAppPlasmaClient = new __1.DAppChainPlasmaClient({
                            dAppClient: dAppClient,
                            callerAddress: callerAddress,
                            database: database,
                            contractName: User._contractName
                        });
                        return [4 /*yield*/, wallet.getAddress()];
                    case 6:
                        defaultAccount = _f.sent();
                        return [2 /*return*/, new User(wallet, {
                                ethPlasmaClient: ethPlasmaClient,
                                dAppPlasmaClient: dAppPlasmaClient,
                                defaultAccount: defaultAccount,
                                defaultGas: 3141592,
                                childBlockInterval: 1000
                            }, startBlock)];
                }
            });
        });
    };
    User.prototype.depositETHAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentBlock, tx, coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.ethers.sendTransaction({
                                to: this.plasmaCashContract.address,
                                value: '0x' + amount.toString(16)
                            })];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 3:
                        coin = _a.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 4:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.receiveAndWatchCoinAsync(coin.slot)];
                    case 5:
                        _a.sent();
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
                        token = new ethers_1.ethers.Contract(address, ERC721_ABI, this.ethers);
                        return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 1:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, token.safeTransferFrom(this.ethAddress, this.plasmaCashContract.address, '0x' + uid.toString(16), { gasLimit: ethers_1.ethers.utils.hexlify(this._defaultGas) })];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 3:
                        coin = _a.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 4:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.receiveAndWatchCoinAsync(coin.slot)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, coin];
                }
            });
        });
    };
    User.prototype.depositERC20Async = function (amount, address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var token, valueApproved, currentApproval, currentBlock, tx, coin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = new ethers_1.ethers.Contract(address, ERC20_ABI, this.ethers);
                        return [4 /*yield*/, token.allowance(this.ethAddress, this.plasmaCashContract.address)];
                    case 1:
                        valueApproved = _a.sent();
                        currentApproval = new bn_js_1.default(ethers_1.utils.bigNumberify(valueApproved).toString());
                        if (!amount.gt(currentApproval)) return [3 /*break*/, 3];
                        return [4 /*yield*/, token.approve(this.plasmaCashContract.address, amount.sub(currentApproval).toString())];
                    case 2:
                        _a.sent();
                        debugLog('Approved an extra', amount.sub(currentApproval));
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getCurrentBlockAsync()];
                    case 4:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.plasmaCashContract.depositERC20(amount.toString(), address)];
                    case 5:
                        tx = _a.sent();
                        return [4 /*yield*/, this.getCoinFromTxAsync(tx)];
                    case 6:
                        coin = _a.sent();
                        return [4 /*yield*/, this.pollForBlockChange(currentBlock, 20, 2000)];
                    case 7:
                        currentBlock = _a.sent();
                        return [4 /*yield*/, this.receiveAndWatchCoinAsync(coin.slot)];
                    case 8:
                        _a.sent();
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
                        _b = (_a = this.plasmaEvents.events).SubmittedBlock;
                        _c = {
                            filter: {}
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 2:
                        watcher = _b.apply(_a, [(_c.fromBlock = _d.sent(),
                                _c)])
                            .on('data', function (event, err) {
                            if (_this.verifyInclusionAsync(slot, new bn_js_1.default(event.returnValues.blockNumber))) {
                                debugLog(_this.prefix(slot) + " Tx included & verified in block " + event.returnValues.blockNumber);
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
                            .on('error', function (err) { return errorLog(err); });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Transfer a coin by specifying slot & new owner
    User.prototype.transferAsync = function (slot, newOwner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blockNum;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findBlocks(slot)];
                    case 1:
                        blockNum = (_a.sent()).blockNum;
                        return [4 /*yield*/, this.transferTokenAsync({
                                slot: slot,
                                prevBlockNum: blockNum,
                                denomination: 1,
                                newOwner: newOwner
                            })];
                    case 2:
                        _a.sent();
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
                        debugLog("[" + this.ethAddress + "] Watching for blocks...");
                        _a = this;
                        _c = (_b = this.plasmaEvents.events).SubmittedBlock;
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
                                        debugLog("[" + this.ethAddress + "] Got new block: " + blk);
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
                                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                                        i = _a[_i];
                                        coin = coins[i];
                                        exists = false;
                                        for (j in localCoins) {
                                            if (coin.slot.eq(localCoins[j]))
                                                exists = true;
                                        }
                                        if (!exists) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.getPlasmaTxAsync(coin.slot, blk)
                                            // TODO: If a new block arrives and we have the coin already in state but are not watching for its exits, e.g. after restarting the client, we need to start watching again.
                                        ]; // this will add the coin to state
                                    case 4:
                                        _c.sent(); // this will add the coin to state
                                        return [3 /*break*/, 7];
                                    case 5: return [4 /*yield*/, this.receiveAndWatchCoinAsync(coin.slot)];
                                    case 6:
                                        _c.sent();
                                        _c.label = 7;
                                    case 7:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); })
                            .on('error', function (err) { return errorLog(err); });
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
                        return [4 /*yield*/, this.plasmaEvents.getPastEvents('StartedExit', {
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
                        debugLog(this.prefix(slot) + " Verified history, started watching.");
                        return [3 /*break*/, 7];
                    case 6:
                        this.database.removeCoin(slot);
                        debugLog(this.prefix(slot) + " Invalid history, rejecting...");
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, prevBlockNum, blockNum, tx;
            var _this = this;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        // Once the exit is started, stop watching for exit events
                        _b = (_a = this.plasmaEvents).once;
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
                        _f = (_e = this.plasmaEvents).once;
                        _g = ['FinalizedExit'];
                        _h = {
                            filter: { slot: slot.toString() }
                        };
                        return [4 /*yield*/, this.web3.eth.getBlockNumber()];
                    case 2:
                        // Once the exit has been finalized, stop watching for challenge events
                        _f.apply(_e, _g.concat([(_h.fromBlock = _k.sent(),
                                _h), function () {
                                _this.stopWatching(slot);
                            }]));
                        return [4 /*yield*/, this.findBlocks(slot)];
                    case 3:
                        _j = _k.sent(), prevBlockNum = _j.prevBlockNum, blockNum = _j.blockNum;
                        return [4 /*yield*/, this.startExitAsync({
                                slot: slot,
                                prevBlockNum: prevBlockNum,
                                exitBlockNum: blockNum
                            })];
                    case 4:
                        tx = _k.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 5:
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
                        return [2 /*return*/, Promise.all(coins)];
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
                        return [2 /*return*/, Promise.all(coins)];
                }
            });
        });
    };
    User.prototype.disconnect = function () {
        // @ts-ignore
        this.web3.currentProvider.connection.close();
        this.plasmaEvents.currentProvider.connection.close();
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