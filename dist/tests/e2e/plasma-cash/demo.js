"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var web3_1 = tslib_1.__importDefault(require("web3"));
var ganache_helpers_1 = require("./ganache-helpers");
var config_1 = require("./config");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
// Alice registers and has 5 coins, and she deposits 3 of them.
var ALICE_INITIAL_COINS = 5;
var ALICE_DEPOSITED_COINS = 3;
var COINS = [1, 2, 3];
function runDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, cards, cardsAddress, accounts, alice, bob, charlie, balance, depositsStartBlock, i, deposits, i, deposit, coins, deposit2, deposit3, currentBlock, aliceCoins, _a, _b, _c, _d, bobCoins, charlieCoins, coin, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config_1.web3Endpoint));
                    cards = config_1.setupContracts(web3).cards;
                    cardsAddress = config_1.ADDRESSES.token_contract;
                    return [4 /*yield*/, config_1.setupAccounts()];
                case 1:
                    accounts = _g.sent();
                    alice = accounts.alice;
                    bob = accounts.bob;
                    charlie = accounts.charlie;
                    return [4 /*yield*/, cards.registerAsync(alice.ethAddress)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, cards.balanceOfAsync(alice.ethAddress)];
                case 3:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), 5);
                    return [4 /*yield*/, alice.getCurrentBlockAsync()];
                case 4:
                    depositsStartBlock = _g.sent();
                    i = 0;
                    _g.label = 5;
                case 5:
                    if (!(i < ALICE_DEPOSITED_COINS)) return [3 /*break*/, 8];
                    return [4 /*yield*/, alice.depositERC721Async(new bn_js_1.default(COINS[i]), cardsAddress)];
                case 6:
                    _g.sent();
                    _g.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log('GETTING DEPOSITS');
                    return [4 /*yield*/, alice.deposits()];
                case 9:
                    deposits = _g.sent();
                    t.equal(deposits.length, ALICE_DEPOSITED_COINS, 'All deposit events accounted for');
                    for (i = 0; i < deposits.length; i++) {
                        deposit = deposits[i];
                        t.equal(deposit.depositBlockNum.toNumber(), depositsStartBlock.toNumber() + i + 1, "Deposit " + (i + 1) + " block number is correct");
                        t.equal(deposit.denomination.toNumber(), 1, "Deposit " + (i + 1) + " denomination is correct");
                        t.equal(deposit.owner, alice.ethAddress, "Deposit " + (i + 1) + " sender is correct");
                    }
                    return [4 /*yield*/, cards.balanceOfAsync(alice.ethAddress)];
                case 10:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), ALICE_INITIAL_COINS - ALICE_DEPOSITED_COINS, 'alice should have 2 tokens in cards contract');
                    return [4 /*yield*/, cards.balanceOfAsync(config_1.ADDRESSES.root_chain)];
                case 11:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), ALICE_DEPOSITED_COINS, 'plasma contract should have 3 tokens in cards contract');
                    return [4 /*yield*/, alice.getUserCoinsAsync()];
                case 12:
                    coins = _g.sent();
                    t.ok(coins[0].slot.eq(deposits[0].slot), 'got correct deposit coins 1');
                    t.ok(coins[1].slot.eq(deposits[1].slot), 'got correct deposit coins 2');
                    t.ok(coins[2].slot.eq(deposits[2].slot), 'got correct deposit coins 3');
                    deposit2 = deposits[1];
                    deposit3 = deposits[2];
                    return [4 /*yield*/, alice.getCurrentBlockAsync()
                        // Alice -> Bob
                    ];
                case 13:
                    currentBlock = _g.sent();
                    // Alice -> Bob
                    return [4 /*yield*/, alice.transferAndVerifyAsync(deposit3.slot, bob.ethAddress, 6)
                        // // Alice -> Charlie
                    ];
                case 14:
                    // Alice -> Bob
                    _g.sent();
                    // // Alice -> Charlie
                    return [4 /*yield*/, alice.transferAndVerifyAsync(deposit2.slot, charlie.ethAddress, 6)];
                case 15:
                    // // Alice -> Charlie
                    _g.sent();
                    return [4 /*yield*/, alice.pollForBlockChange(currentBlock, 20, 2000)];
                case 16:
                    currentBlock = _g.sent();
                    return [4 /*yield*/, alice.getUserCoinsAsync()];
                case 17:
                    aliceCoins = _g.sent();
                    t.ok(aliceCoins[0].slot.eq(deposits[0].slot), 'Alice has correct coin');
                    _b = (_a = t).equal;
                    return [4 /*yield*/, charlie.receiveAndWatchCoinAsync(deposit2.slot)];
                case 18:
                    _b.apply(_a, [_g.sent(), true, 'charlie received coin']);
                    _d = (_c = t).equal;
                    return [4 /*yield*/, bob.receiveAndWatchCoinAsync(deposit3.slot)];
                case 19:
                    _d.apply(_c, [_g.sent(), true, 'bob received coin']);
                    if (!(bob.contractName !== 'hostileoperator')) return [3 /*break*/, 22];
                    return [4 /*yield*/, bob.getUserCoinsAsync()];
                case 20:
                    bobCoins = _g.sent();
                    t.ok(bobCoins[0].slot.eq(deposit3.slot), 'Bob has correct coin');
                    return [4 /*yield*/, charlie.getUserCoinsAsync()];
                case 21:
                    charlieCoins = _g.sent();
                    t.ok(charlieCoins[0].slot.eq(deposit2.slot), 'Charlie has correct coin');
                    _g.label = 22;
                case 22: 
                // // Bob -> Charlie
                return [4 /*yield*/, bob.transferAndVerifyAsync(deposit3.slot, charlie.ethAddress, 6)];
                case 23:
                    // // Bob -> Charlie
                    _g.sent();
                    return [4 /*yield*/, bob.pollForBlockChange(currentBlock, 20, 2000)];
                case 24:
                    currentBlock = _g.sent();
                    return [4 /*yield*/, charlie.getPlasmaCoinAsync(deposit3.slot)];
                case 25:
                    coin = _g.sent();
                    _f = (_e = t).equal;
                    return [4 /*yield*/, charlie.receiveAndWatchCoinAsync(deposit3.slot)];
                case 26:
                    _f.apply(_e, [_g.sent(), true, 'Coin history verified']);
                    return [4 /*yield*/, charlie.exitAsync(deposit3.slot)
                        // Jump forward in time by 8 days
                    ];
                case 27:
                    _g.sent();
                    // Jump forward in time by 8 days
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)
                        // Charlie's exit should be finalizable...
                    ];
                case 28:
                    // Jump forward in time by 8 days
                    _g.sent();
                    // Charlie's exit should be finalizable...
                    return [4 /*yield*/, charlie.finalizeExitAsync(deposit3.slot)
                        // // Charlie should now be able to withdraw the UTXO (plasma token) which contains ERC721 token #2
                        // // into his wallet.
                    ];
                case 29:
                    // Charlie's exit should be finalizable...
                    _g.sent();
                    // // Charlie should now be able to withdraw the UTXO (plasma token) which contains ERC721 token #2
                    // // into his wallet.
                    return [4 /*yield*/, charlie.withdrawAsync(deposit3.slot)];
                case 30:
                    // // Charlie should now be able to withdraw the UTXO (plasma token) which contains ERC721 token #2
                    // // into his wallet.
                    _g.sent();
                    return [4 /*yield*/, cards.balanceOfAsync(alice.ethAddress)];
                case 31:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), 2, 'alice should have 2 tokens in cards contract');
                    return [4 /*yield*/, cards.balanceOfAsync(bob.ethAddress)];
                case 32:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), 0, 'bob should have no tokens in cards contract');
                    return [4 /*yield*/, cards.balanceOfAsync(charlie.ethAddress)];
                case 33:
                    balance = _g.sent();
                    t.equal(balance.toNumber(), 1, 'charlie should have 1 token in cards contract');
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runDemo = runDemo;
//# sourceMappingURL=demo.js.map