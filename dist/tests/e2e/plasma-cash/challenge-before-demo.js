"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
var ganache_helpers_1 = require("./ganache-helpers");
var config_1 = require("./config");
function runChallengeBeforeDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, cards, cardsAddress, accounts, dan, mallory, trudy, balance, deposits, deposit1Slot, coin, currentBlock, trudyToMalloryBlock, malloryToTrudyBlock, danBalanceBefore, danBalanceAfter, danTokensEnd;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config_1.web3Endpoint));
                    cards = config_1.setupContracts(web3).cards;
                    cardsAddress = config_1.ADDRESSES.token_contract;
                    return [4 /*yield*/, config_1.setupAccounts()];
                case 1:
                    accounts = _a.sent();
                    dan = accounts.dan;
                    mallory = accounts.mallory;
                    trudy = accounts.trudy;
                    // Give Dan 5 tokens
                    return [4 /*yield*/, cards.registerAsync(dan.ethAddress)];
                case 2:
                    // Give Dan 5 tokens
                    _a.sent();
                    return [4 /*yield*/, cards.balanceOfAsync(dan.ethAddress)];
                case 3:
                    balance = _a.sent();
                    t.equal(balance.toNumber(), 6);
                    // Dan deposits a coin
                    return [4 /*yield*/, dan.depositERC721Async(new bn_js_1.default(16), cardsAddress)];
                case 4:
                    // Dan deposits a coin
                    _a.sent();
                    return [4 /*yield*/, dan.deposits()];
                case 5:
                    deposits = _a.sent();
                    t.equal(deposits.length, 1, 'All deposit events accounted for');
                    deposit1Slot = deposits[0].slot;
                    return [4 /*yield*/, dan.getPlasmaCoinAsync(deposit1Slot)
                        // Trudy creates an invalid spend of the coin to Mallory
                    ];
                case 6:
                    coin = _a.sent();
                    return [4 /*yield*/, trudy.getCurrentBlockAsync()];
                case 7:
                    currentBlock = _a.sent();
                    return [4 /*yield*/, trudy.transferAndVerifyAsync(deposit1Slot, mallory.ethAddress, 6)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trudy.pollForBlockChange(currentBlock, 20, 2000)];
                case 9:
                    trudyToMalloryBlock = _a.sent();
                    return [4 /*yield*/, mallory.transferAndVerifyAsync(deposit1Slot, trudy.ethAddress, 6)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, mallory.pollForBlockChange(trudyToMalloryBlock, 20, 2000)
                        // Low level call for the malicious exit
                    ];
                case 11:
                    malloryToTrudyBlock = _a.sent();
                    // Low level call for the malicious exit
                    return [4 /*yield*/, trudy.startExitAsync({
                            slot: deposit1Slot,
                            prevBlockNum: trudyToMalloryBlock,
                            exitBlockNum: malloryToTrudyBlock
                        })
                        // Dan challenges with his coin that hasn't moved
                    ];
                case 12:
                    // Low level call for the malicious exit
                    _a.sent();
                    // Dan challenges with his coin that hasn't moved
                    return [4 /*yield*/, config_1.sleep(2000)
                        // 8 days pass without any response to the challenge
                    ];
                case 13:
                    // Dan challenges with his coin that hasn't moved
                    _a.sent();
                    // 8 days pass without any response to the challenge
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 14:
                    // 8 days pass without any response to the challenge
                    _a.sent();
                    return [4 /*yield*/, dan.finalizeExitAsync(deposit1Slot)
                        // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    ];
                case 15:
                    _a.sent();
                    // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    return [4 /*yield*/, dan.startExitAsync({
                            slot: deposit1Slot,
                            prevBlockNum: new bn_js_1.default(0),
                            exitBlockNum: coin.depositBlockNum
                        })
                        // Jump forward in time by 8 days
                    ];
                case 16:
                    // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    _a.sent();
                    // Jump forward in time by 8 days
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 17:
                    // Jump forward in time by 8 days
                    _a.sent();
                    return [4 /*yield*/, dan.finalizeExitAsync(deposit1Slot)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, dan.withdrawAsync(deposit1Slot)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 20:
                    danBalanceBefore = _a.sent();
                    return [4 /*yield*/, dan.withdrawBondsAsync()];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 22:
                    danBalanceAfter = _a.sent();
                    t.ok(danBalanceBefore.cmp(danBalanceAfter) < 0, 'END: Dan withdrew his bonds');
                    return [4 /*yield*/, cards.balanceOfAsync(dan.ethAddress)];
                case 23:
                    danTokensEnd = _a.sent();
                    t.equal(danTokensEnd.toNumber(), 6, 'END: Dan has correct number of tokens');
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runChallengeBeforeDemo = runChallengeBeforeDemo;
//# sourceMappingURL=challenge-before-demo.js.map