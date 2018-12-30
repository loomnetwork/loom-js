"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var web3_1 = tslib_1.__importDefault(require("web3"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var ganache_helpers_1 = require("./ganache-helpers");
var config_1 = require("./config");
function runChallengeBetweenDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, cards, cardsAddress, accounts, alice, bob, eve, bobTokensStart, deposits, deposit1Slot, coin, currentBlock, _a, _b, _c, _d, bobBalanceBefore, bobBalanceAfter, bobTokensEnd;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config_1.web3Endpoint));
                    cards = config_1.setupContracts(web3).cards;
                    cardsAddress = config_1.ADDRESSES.token_contract;
                    return [4 /*yield*/, config_1.setupAccounts()];
                case 1:
                    accounts = _e.sent();
                    alice = accounts.alice;
                    bob = accounts.bob;
                    eve = accounts.eve;
                    return [4 /*yield*/, cards.balanceOfAsync(bob.ethAddress)
                        // Give Eve 5 tokens
                    ];
                case 2:
                    bobTokensStart = _e.sent();
                    // Give Eve 5 tokens
                    return [4 /*yield*/, cards.registerAsync(eve.ethAddress)
                        // Eve deposits a coin
                    ];
                case 3:
                    // Give Eve 5 tokens
                    _e.sent();
                    // Eve deposits a coin
                    return [4 /*yield*/, eve.depositERC721Async(new bn_js_1.default(11), cardsAddress)];
                case 4:
                    // Eve deposits a coin
                    _e.sent();
                    return [4 /*yield*/, eve.deposits()];
                case 5:
                    deposits = _e.sent();
                    t.equal(deposits.length, 1, 'Eve has correct number of deposits');
                    deposit1Slot = deposits[0].slot;
                    return [4 /*yield*/, eve.getPlasmaCoinAsync(deposit1Slot)];
                case 6:
                    coin = _e.sent();
                    return [4 /*yield*/, eve.getCurrentBlockAsync()];
                case 7:
                    currentBlock = _e.sent();
                    return [4 /*yield*/, eve.transferAndVerifyAsync(deposit1Slot, bob.ethAddress, 6)];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, eve.pollForBlockChange(currentBlock, 20, 2000)];
                case 9:
                    currentBlock = _e.sent();
                    _b = (_a = t).equal;
                    return [4 /*yield*/, bob.receiveAndWatchCoinAsync(deposit1Slot)];
                case 10:
                    _b.apply(_a, [_e.sent(), true, 'Coin history verified']);
                    // Eve sends this same plasma coin to Alice
                    return [4 /*yield*/, eve.transferAndVerifyAsync(deposit1Slot, alice.ethAddress, 6)];
                case 11:
                    // Eve sends this same plasma coin to Alice
                    _e.sent();
                    return [4 /*yield*/, eve.pollForBlockChange(currentBlock, 20, 2000)
                        // Alice attempts to exit her double-spent coin
                        // Low level call to exit the double spend
                    ];
                case 12:
                    currentBlock = _e.sent();
                    // Alice attempts to exit her double-spent coin
                    // Low level call to exit the double spend
                    _d = (_c = t).equal;
                    return [4 /*yield*/, alice.receiveAndWatchCoinAsync(deposit1Slot)];
                case 13:
                    // Alice attempts to exit her double-spent coin
                    // Low level call to exit the double spend
                    _d.apply(_c, [_e.sent(), false, 'Alice accepted faux coin']);
                    return [4 /*yield*/, alice.startExitAsync({
                            slot: deposit1Slot,
                            prevBlockNum: coin.depositBlockNum,
                            exitBlockNum: currentBlock
                        })
                        // Bob challenges here
                    ];
                case 14:
                    _e.sent();
                    // Bob challenges here
                    return [4 /*yield*/, config_1.sleep(2000)];
                case 15:
                    // Bob challenges here
                    _e.sent();
                    return [4 /*yield*/, bob.exitAsync(deposit1Slot)
                        // Jump forward in time by 8 days
                    ];
                case 16:
                    _e.sent();
                    // Jump forward in time by 8 days
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 17:
                    // Jump forward in time by 8 days
                    _e.sent();
                    return [4 /*yield*/, bob.finalizeExitAsync(deposit1Slot)];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, bob.withdrawAsync(deposit1Slot)];
                case 19:
                    _e.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, bob.ethAddress)];
                case 20:
                    bobBalanceBefore = _e.sent();
                    return [4 /*yield*/, bob.withdrawBondsAsync()];
                case 21:
                    _e.sent();
                    return [4 /*yield*/, ganache_helpers_1.getEthBalanceAtAddress(web3, bob.ethAddress)];
                case 22:
                    bobBalanceAfter = _e.sent();
                    t.ok(bobBalanceBefore.cmp(bobBalanceAfter) < 0, 'END: Bob withdrew his bonds');
                    return [4 /*yield*/, cards.balanceOfAsync(bob.ethAddress)];
                case 23:
                    bobTokensEnd = _e.sent();
                    t.equal(bobTokensEnd.toNumber(), bobTokensStart.toNumber() + 1, 'END: Bob has correct number of tokens');
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runChallengeBetweenDemo = runChallengeBetweenDemo;
//# sourceMappingURL=challenge-between-demo.js.map