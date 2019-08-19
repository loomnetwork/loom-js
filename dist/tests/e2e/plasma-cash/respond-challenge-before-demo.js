"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
var ganache_helpers_1 = require("./ganache-helpers");
var config_1 = require("./config");
function runRespondChallengeBeforeDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, cards, cardsAddress, accounts, dan, trudy, balance, deposits, deposit1Slot, coin, currentBlock, danBalanceBefore, danBalanceAfter, danTokensEnd;
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
                    trudy = accounts.trudy;
                    // Give Trudy 5 tokens
                    return [4 /*yield*/, cards.registerAsync(trudy.ethAddress)];
                case 2:
                    // Give Trudy 5 tokens
                    _a.sent();
                    return [4 /*yield*/, cards.balanceOfAsync(trudy.ethAddress)];
                case 3:
                    balance = _a.sent();
                    t.equal(balance.toNumber(), 5);
                    // Trudy deposits a coin
                    return [4 /*yield*/, trudy.depositERC721Async(new bn_js_1.default(21), cardsAddress)];
                case 4:
                    // Trudy deposits a coin
                    _a.sent();
                    return [4 /*yield*/, trudy.deposits()];
                case 5:
                    deposits = _a.sent();
                    t.equal(deposits.length, 1, 'All deposit events accounted for');
                    deposit1Slot = deposits[0].slot;
                    return [4 /*yield*/, trudy.getPlasmaCoinAsync(deposit1Slot)];
                case 6:
                    coin = _a.sent();
                    return [4 /*yield*/, trudy.getCurrentBlockAsync()];
                case 7:
                    currentBlock = _a.sent();
                    return [4 /*yield*/, trudy.transferAndVerifyAsync(deposit1Slot, dan.ethAddress, 6)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trudy.pollForBlockChange(currentBlock, 20, 2000)
                        // Dan exits the coin received by Trudy
                    ];
                case 9:
                    currentBlock = _a.sent();
                    // Dan exits the coin received by Trudy
                    return [4 /*yield*/, dan.exitAsync(deposit1Slot)
                        // Trudy tries to challengeBefore Dan's exit
                    ];
                case 10:
                    // Dan exits the coin received by Trudy
                    _a.sent();
                    // Trudy tries to challengeBefore Dan's exit
                    return [4 /*yield*/, trudy.challengeBeforeAsync({
                            slot: deposit1Slot,
                            challengingBlockNum: coin.depositBlockNum
                        })];
                case 11:
                    // Trudy tries to challengeBefore Dan's exit
                    _a.sent();
                    return [4 /*yield*/, config_1.sleep(2000)
                        // Jump forward in time by 8 days
                    ];
                case 12:
                    _a.sent();
                    // Jump forward in time by 8 days
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 13:
                    // Jump forward in time by 8 days
                    _a.sent();
                    return [4 /*yield*/, dan.finalizeExitAsync(deposit1Slot)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, dan.withdrawAsync(deposit1Slot)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 16:
                    danBalanceBefore = _a.sent();
                    return [4 /*yield*/, dan.withdrawBondsAsync()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, dan.ethAddress)];
                case 18:
                    danBalanceAfter = _a.sent();
                    t.ok(danBalanceBefore.cmp(danBalanceAfter) < 0, 'END: Dan withdrew his bonds');
                    return [4 /*yield*/, cards.balanceOfAsync(dan.ethAddress)
                        // Dan had initially 5 from when he registered and he received 2 coins
                        // 1 in this demo and 1 in a previous one.
                    ];
                case 19:
                    danTokensEnd = _a.sent();
                    // Dan had initially 5 from when he registered and he received 2 coins
                    // 1 in this demo and 1 in a previous one.
                    t.equal(danTokensEnd.toNumber(), 7, 'END: Dan has correct number of tokens');
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runRespondChallengeBeforeDemo = runRespondChallengeBeforeDemo;
//# sourceMappingURL=respond-challenge-before-demo.js.map