"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var web3_1 = tslib_1.__importDefault(require("web3"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var config_1 = require("./config");
var ganache_helpers_1 = require("./ganache-helpers");
var config_2 = require("./config");
function runChallengeAfterDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, cards, cardsAddress, accounts, mallory, dan, danTokensStart, malloryTokensStart, deposits, malloryTokensPostDeposit, deposit1Slot, coin, currentBlock, _a, _b, danBalanceBefore, danBalanceAfter, malloryTokensEnd, danTokensEnd;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config_2.web3Endpoint));
                    cards = config_2.setupContracts(web3).cards;
                    cardsAddress = config_2.ADDRESSES.token_contract;
                    return [4 /*yield*/, config_1.setupAccounts()];
                case 1:
                    accounts = _c.sent();
                    mallory = accounts.mallory;
                    dan = accounts.dan;
                    // Give Mallory 5 tokens
                    return [4 /*yield*/, cards.registerAsync(mallory.ethAddress)];
                case 2:
                    // Give Mallory 5 tokens
                    _c.sent();
                    return [4 /*yield*/, cards.balanceOfAsync(dan.ethAddress)];
                case 3:
                    danTokensStart = _c.sent();
                    t.equal(danTokensStart.toNumber(), 0, 'START: Dan has correct number of tokens');
                    return [4 /*yield*/, cards.balanceOfAsync(mallory.ethAddress)];
                case 4:
                    malloryTokensStart = _c.sent();
                    t.equal(malloryTokensStart.toNumber(), 5, 'START: Mallory has correct number of tokens');
                    // Mallory deposits one of her coins to the plasma contract
                    return [4 /*yield*/, mallory.depositERC721Async(new bn_js_1.default(6), cardsAddress)];
                case 5:
                    // Mallory deposits one of her coins to the plasma contract
                    _c.sent();
                    return [4 /*yield*/, mallory.depositERC721Async(new bn_js_1.default(7), cardsAddress)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, mallory.deposits()];
                case 7:
                    deposits = _c.sent();
                    t.equal(deposits.length, 2, 'Mallory has correct number of deposits');
                    return [4 /*yield*/, cards.balanceOfAsync(mallory.ethAddress)];
                case 8:
                    malloryTokensPostDeposit = _c.sent();
                    t.equal(malloryTokensPostDeposit.toNumber(), 3, 'POST-DEPOSIT: Mallory has correct number of tokens');
                    deposit1Slot = deposits[0].slot;
                    return [4 /*yield*/, mallory.getPlasmaCoinAsync(deposit1Slot)];
                case 9:
                    coin = _c.sent();
                    return [4 /*yield*/, mallory.getCurrentBlockAsync()];
                case 10:
                    currentBlock = _c.sent();
                    return [4 /*yield*/, mallory.transferAndVerifyAsync(deposit1Slot, dan.ethAddress, 6)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, mallory.pollForBlockChange(currentBlock, 20, 2000)];
                case 12:
                    currentBlock = _c.sent();
                    _b = (_a = t).equal;
                    return [4 /*yield*/, dan.receiveAndWatchCoinAsync(deposit1Slot)];
                case 13:
                    _b.apply(_a, [_c.sent(), true, 'Coin history verified']);
                    // Mallory attempts to exit spent coin (the one sent to Dan)
                    // Needs to use the low level API to make an invalid tx
                    return [4 /*yield*/, mallory.startExitAsync({
                            slot: deposit1Slot,
                            prevBlockNum: new bn_js_1.default(0),
                            exitBlockNum: coin.depositBlockNum
                        })
                        // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    ];
                case 14:
                    // Mallory attempts to exit spent coin (the one sent to Dan)
                    // Needs to use the low level API to make an invalid tx
                    _c.sent();
                    // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    return [4 /*yield*/, dan.exitAsync(deposit1Slot)
                        // Jump forward in time by 8 days
                    ];
                case 15:
                    // Having successufly challenged Mallory's exit Dan should be able to exit the coin
                    _c.sent();
                    // Jump forward in time by 8 days
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 16:
                    // Jump forward in time by 8 days
                    _c.sent();
                    return [4 /*yield*/, dan.finalizeExitAsync(deposit1Slot)];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, dan.withdrawAsync(deposit1Slot)];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 19:
                    danBalanceBefore = _c.sent();
                    return [4 /*yield*/, dan.withdrawBondsAsync()];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 21:
                    danBalanceAfter = _c.sent();
                    t.ok(danBalanceBefore.cmp(danBalanceAfter) < 0, 'END: Dan withdrew his bonds');
                    return [4 /*yield*/, cards.balanceOfAsync(mallory.ethAddress)];
                case 22:
                    malloryTokensEnd = _c.sent();
                    t.equal(malloryTokensEnd.toNumber(), 3, 'END: Mallory has correct number of tokens');
                    return [4 /*yield*/, cards.balanceOfAsync(dan.ethAddress)];
                case 23:
                    danTokensEnd = _c.sent();
                    t.equal(danTokensEnd.toNumber(), 1, 'END: Dan has correct number of tokens');
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runChallengeAfterDemo = runChallengeAfterDemo;
//# sourceMappingURL=challenge-after-demo.js.map