"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var web3_1 = tslib_1.__importDefault(require("web3"));
var ganache_helpers_1 = require("./ganache-helpers");
var config_1 = require("./config");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
// Complex demo where we try to break the system _lol_
// A whatever interaction between fred and greg (& harry who joins late to the party)
// All interactions happen in ETH
function complexDemo(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var web3, accounts, greg, fred, fred_deposits, greg_deposits, coins, coin1, coin3, coin5, coin2, coin4, currentBlock, slots, _a, _b, _c, _d, _e, _f, _g, _h, harry, _j, _k, _l, _m, _o, _p, e_1, e_2, e_3, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49;
        return tslib_1.__generator(this, function (_50) {
            switch (_50.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(config_1.web3Endpoint));
                    return [4 /*yield*/, config_1.setupAccounts()];
                case 1:
                    accounts = _50.sent();
                    greg = accounts.greg;
                    fred = accounts.fred;
                    // Fred deposits 5000 Wei split across 3 coins
                    // Greg deposits 1000 Wei split across 3 coins
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(1000))];
                case 2:
                    // Fred deposits 5000 Wei split across 3 coins
                    // Greg deposits 1000 Wei split across 3 coins
                    _50.sent();
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(2000))];
                case 3:
                    _50.sent();
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(3000))];
                case 4:
                    _50.sent();
                    return [4 /*yield*/, greg.depositETHAsync(new bn_js_1.default(4000))];
                case 5:
                    _50.sent();
                    return [4 /*yield*/, greg.depositETHAsync(new bn_js_1.default(6000))
                        // Get deposit events for all
                    ];
                case 6:
                    _50.sent();
                    return [4 /*yield*/, fred.deposits()];
                case 7:
                    fred_deposits = _50.sent();
                    return [4 /*yield*/, greg.deposits()];
                case 8:
                    greg_deposits = _50.sent();
                    t.equal(fred_deposits.length, 3, 'Fred deposits correct');
                    t.equal(greg_deposits.length, 2, 'Greg deposits correct');
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 9:
                    coins = _50.sent();
                    t.ok(coins[0].slot.eq(fred_deposits[0].slot), 'fred: got correct deposit coins 1');
                    t.ok(coins[1].slot.eq(fred_deposits[1].slot), 'fred: got correct deposit coins 2');
                    t.ok(coins[2].slot.eq(fred_deposits[2].slot), 'fred: got correct deposit coins 3');
                    return [4 /*yield*/, greg.getUserCoinsAsync()];
                case 10:
                    coins = _50.sent();
                    t.ok(coins[0].slot.eq(greg_deposits[0].slot), 'greg: got correct deposit coins 1');
                    t.ok(coins[1].slot.eq(greg_deposits[1].slot), 'greg: got correct deposit coins 2');
                    coin1 = fred_deposits[0].slot;
                    coin3 = fred_deposits[1].slot;
                    coin5 = fred_deposits[2].slot;
                    coin2 = greg_deposits[0].slot;
                    coin4 = greg_deposits[1].slot;
                    return [4 /*yield*/, fred.watchBlocks()];
                case 11:
                    _50.sent();
                    return [4 /*yield*/, greg.watchBlocks()];
                case 12:
                    _50.sent();
                    return [4 /*yield*/, fred.getCurrentBlockAsync()];
                case 13:
                    currentBlock = _50.sent();
                    fred.transferAndVerifyAsync(coin1, greg.ethAddress);
                    greg.transferAndVerifyAsync(coin2, fred.ethAddress);
                    return [4 /*yield*/, fred.pollForBlockChange(currentBlock, 20, 2000)
                        // They both try to exit and defraud each other
                    ];
                case 14:
                    currentBlock = _50.sent();
                    // They both try to exit and defraud each other
                    return [4 /*yield*/, fred.exitAsync(coin1)];
                case 15:
                    // They both try to exit and defraud each other
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(5000)
                        // Add a sleep in between given that Greg will challenge and we'll get a nonce-too-low error if we
                    ];
                case 16:
                    _50.sent();
                    // Add a sleep in between given that Greg will challenge and we'll get a nonce-too-low error if we
                    return [4 /*yield*/, greg.exitAsync(coin2)
                        // Wait a bit until the challenges are complete
                    ];
                case 17:
                    // Add a sleep in between given that Greg will challenge and we'll get a nonce-too-low error if we
                    _50.sent();
                    // Wait a bit until the challenges are complete
                    return [4 /*yield*/, config_1.sleep(7000)
                        // Greg owns coin 1,4. Need to sort slot values since
                    ];
                case 18:
                    // Wait a bit until the challenges are complete
                    _50.sent();
                    return [4 /*yield*/, greg.getUserCoinsAsync()];
                case 19:
                    slots = (_50.sent()).map(function (c) { return c.slot; }).sort();
                    _b = (_a = t).equal;
                    return [4 /*yield*/, greg.getUserCoinsAsync()];
                case 20:
                    _b.apply(_a, [(_50.sent()).length, 2, 'Greg owns 2 coins']);
                    t.deepEqual(slots, [coin4, coin1].sort(), 'Greg owns the correct coins');
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 21:
                    // Fred owns coin 2,3,5
                    slots = (_50.sent()).map(function (c) { return c.slot; }).sort();
                    _d = (_c = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 22:
                    _d.apply(_c, [(_50.sent()).length, 3, 'fred owns 3 coins']);
                    t.deepEqual(slots, [coin5, coin2, coin3].sort(), 'Greg owns the correct coins');
                    _f = (_e = t).equal;
                    return [4 /*yield*/, greg.getPlasmaCoinAsync(coin1)];
                case 23:
                    _f.apply(_e, [(_50.sent()).state, 0, 'Greg succesfully challenged Fred']);
                    _h = (_g = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin2)];
                case 24:
                    _h.apply(_g, [(_50.sent()).state, 0, 'Fred succesfully challenged Greg']);
                    harry = accounts.harry;
                    return [4 /*yield*/, harry.watchBlocks()
                        // Previously, coin1 went from DEPOSITED -> EXITING and now is back to DEPOSITED. This should be reflected on the dappchain state as well. Build521 does not reset a coin to DEPOSITED after it is in EXITING and is challenged.
                    ];
                case 25:
                    _50.sent();
                    return [4 /*yield*/, fred.getCurrentBlockAsync()];
                case 26:
                    // Previously, coin1 went from DEPOSITED -> EXITING and now is back to DEPOSITED. This should be reflected on the dappchain state as well. Build521 does not reset a coin to DEPOSITED after it is in EXITING and is challenged.
                    currentBlock = _50.sent();
                    greg.transferAndVerifyAsync(coin1, harry.ethAddress).then(function () {
                        greg.transferAndVerifyAsync(coin4, harry.ethAddress);
                    });
                    fred.transferAndVerifyAsync(coin3, harry.ethAddress);
                    return [4 /*yield*/, fred.pollForBlockChange(currentBlock, 20, 2000)
                        // Harry owns coin 1,3,4
                    ];
                case 27:
                    currentBlock = _50.sent();
                    return [4 /*yield*/, harry.getUserCoinsAsync()];
                case 28:
                    // Harry owns coin 1,3,4
                    slots = (_50.sent()).map(function (c) { return c.slot; }).sort();
                    _k = (_j = t).equal;
                    return [4 /*yield*/, harry.getUserCoinsAsync()];
                case 29:
                    _k.apply(_j, [(_50.sent()).length, 3, 'Harry owns 3 coins']);
                    t.deepEqual(slots, [coin1, coin3, coin4].sort(), 'Harry owns the correct coins');
                    _m = (_l = t).equal;
                    return [4 /*yield*/, greg.getUserCoinsAsync()];
                case 30:
                    _m.apply(_l, [(_50.sent()).length, 0, 'greg has no coins']);
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 31:
                    // Fred owns coins 2,5
                    slots = (_50.sent()).map(function (c) { return c.slot; }).sort();
                    _p = (_o = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 32:
                    _p.apply(_o, [(_50.sent()).length, 2, 'Fred owns 2 coins']);
                    t.deepEqual(slots, [coin2, coin5].sort(), 'Fred owns the correct coins');
                    _50.label = 33;
                case 33:
                    _50.trys.push([33, 35, , 36]);
                    // Let's try stealing some money
                    return [4 /*yield*/, greg.transferAndVerifyAsync(coin4, harry.ethAddress)];
                case 34:
                    // Let's try stealing some money
                    _50.sent();
                    return [3 /*break*/, 36];
                case 35:
                    e_1 = _50.sent();
                    t.ok(e_1.message.includes("Failed to commit Tx: [PlasmaCash] failed to process transfer: can't transfer coin " + coin4.toString(10)), 'Tx1 should fail');
                    return [3 /*break*/, 36];
                case 36:
                    _50.trys.push([36, 38, , 39]);
                    // Let's try stealing some money
                    return [4 /*yield*/, greg.transferAndVerifyAsync(coin3, harry.ethAddress)];
                case 37:
                    // Let's try stealing some money
                    _50.sent();
                    return [3 /*break*/, 39];
                case 38:
                    e_2 = _50.sent();
                    t.ok(e_2.message.includes("Failed to commit Tx: [PlasmaCash] failed to process transfer: can't transfer coin " + coin3.toString(10)), 'Tx2 should fail');
                    return [3 /*break*/, 39];
                case 39:
                    _50.trys.push([39, 41, , 42]);
                    // Let's try stealing some money
                    return [4 /*yield*/, greg.transferAndVerifyAsync(coin1, harry.ethAddress)];
                case 40:
                    // Let's try stealing some money
                    _50.sent();
                    return [3 /*break*/, 42];
                case 41:
                    e_3 = _50.sent();
                    t.ok(e_3.message.includes("Failed to commit Tx: [PlasmaCash] failed to process transfer: can't transfer coin " + coin1.toString(10)), 'Tx3 should fail');
                    return [3 /*break*/, 42];
                case 42:
                    _r = (_q = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 43:
                    _r.apply(_q, [(_50.sent()).length, 2, 'Fred still owns 2 coins']);
                    // spam a bit
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 44:
                    // spam a bit
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 45:
                    _50.sent();
                    _t = (_s = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 46:
                    _t.apply(_s, [(_50.sent()).length, 3, 'Fred owns 3 coins']);
                    return [4 /*yield*/, harry.getCurrentBlockAsync()];
                case 47:
                    currentBlock = _50.sent();
                    return [4 /*yield*/, harry.transferAndVerifyAsync(coin4, greg.ethAddress)];
                case 48:
                    _50.sent();
                    return [4 /*yield*/, harry.pollForBlockChange(currentBlock, 20, 2000)];
                case 49:
                    currentBlock = _50.sent();
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 50:
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 51:
                    _50.sent();
                    _v = (_u = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 52:
                    _v.apply(_u, [(_50.sent()).length, 4, 'Fred owns 4 coins']);
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 53:
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 54:
                    _50.sent();
                    _x = (_w = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 55:
                    _x.apply(_w, [(_50.sent()).length, 5, 'Fred owns 5 coins']);
                    // spam a bit
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 56:
                    // spam a bit
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 57:
                    _50.sent();
                    _z = (_y = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 58:
                    _z.apply(_y, [(_50.sent()).length, 6, 'Fred owns 6 coins']);
                    return [4 /*yield*/, greg.getCurrentBlockAsync()];
                case 59:
                    currentBlock = _50.sent();
                    greg.transferAndVerifyAsync(coin4, harry.ethAddress);
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 60:
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 61:
                    _50.sent();
                    _1 = (_0 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 62:
                    _1.apply(_0, [(_50.sent()).length, 7, 'Fred owns 7 coins']);
                    return [4 /*yield*/, fred.depositETHAsync(new bn_js_1.default(10000))];
                case 63:
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(3000)];
                case 64:
                    _50.sent();
                    _3 = (_2 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 65:
                    _3.apply(_2, [(_50.sent()).length, 8, 'Fred owns 8 coins']);
                    _5 = (_4 = t).equal;
                    return [4 /*yield*/, harry.getUserCoinsAsync()];
                case 66:
                    _5.apply(_4, [(_50.sent()).length, 3, 'Harry still owns 3 coins']);
                    return [4 /*yield*/, harry.exitAsync(coin4)];
                case 67:
                    _50.sent();
                    return [4 /*yield*/, harry.exitAsync(coin1)];
                case 68:
                    _50.sent();
                    return [4 /*yield*/, harry.exitAsync(coin3)];
                case 69:
                    _50.sent();
                    return [4 /*yield*/, config_1.sleep(5000)];
                case 70:
                    _50.sent();
                    _7 = (_6 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 71:
                    _7.apply(_6, [(_50.sent()).length, 8, 'Fred still owns 8 coins']);
                    return [4 /*yield*/, fred.exitAsync(coin2)];
                case 72:
                    _50.sent();
                    return [4 /*yield*/, fred.exitAsync(coin5)];
                case 73:
                    _50.sent();
                    _9 = (_8 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 74:
                    _9.apply(_8, [(_50.sent()).length, 8, 'Fred still owns 8 coins']);
                    return [4 /*yield*/, config_1.sleep(5000)];
                case 75:
                    _50.sent();
                    _11 = (_10 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin2)];
                case 76:
                    _11.apply(_10, [(_50.sent()).state,
                        1,
                        'Fred succesfully started an exit for coin 2']);
                    _13 = (_12 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin5)];
                case 77:
                    _13.apply(_12, [(_50.sent()).state,
                        1,
                        'Fred succesfully started an exit for coin 5']);
                    _15 = (_14 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin3)];
                case 78:
                    _15.apply(_14, [(_50.sent()).state,
                        1,
                        'Harry succesfully started an exit for coin 3']);
                    _17 = (_16 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin4)];
                case 79:
                    _17.apply(_16, [(_50.sent()).state,
                        1,
                        'Harry succesfully started an exit for coin 4']);
                    _19 = (_18 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin1)];
                case 80:
                    _19.apply(_18, [(_50.sent()).state,
                        1,
                        'Harry succesfully started an exit for coin 1']);
                    _21 = (_20 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 81:
                    _21.apply(_20, [(_50.sent()).length, 8, 'Fred still owns 8 coins']);
                    // Greg for some whatever reason decides to finalize all exits
                    return [4 /*yield*/, ganache_helpers_1.increaseTime(web3, 8 * 24 * 3600)];
                case 82:
                    // Greg for some whatever reason decides to finalize all exits
                    _50.sent();
                    return [4 /*yield*/, fred.finalizeExitsAsync([coin2, coin5])];
                case 83:
                    _50.sent();
                    return [4 /*yield*/, harry.finalizeExitsAsync([coin1, coin3, coin4])];
                case 84:
                    _50.sent();
                    _23 = (_22 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin2)];
                case 85:
                    _23.apply(_22, [(_50.sent()).state,
                        2,
                        'Fred succesfully finalized the exit for coin 2']);
                    _25 = (_24 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin5)];
                case 86:
                    _25.apply(_24, [(_50.sent()).state,
                        2,
                        'Fred succesfully finalized the exit for coin 5']);
                    _27 = (_26 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin3)];
                case 87:
                    _27.apply(_26, [(_50.sent()).state,
                        2,
                        'Harry succesfully finalized the exit for coin 3']);
                    _29 = (_28 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin4)];
                case 88:
                    _29.apply(_28, [(_50.sent()).state,
                        2,
                        'Harry succesfully finalized the exit for coin 4']);
                    _31 = (_30 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin1)];
                case 89:
                    _31.apply(_30, [(_50.sent()).state,
                        2,
                        'Harry succesfully finalized the exit for coin 1']);
                    _33 = (_32 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 90:
                    _33.apply(_32, [(_50.sent()).length, 8, 'Fred still owns 8 coins']);
                    return [4 /*yield*/, fred.withdrawAsync(coin2)];
                case 91:
                    _50.sent();
                    return [4 /*yield*/, fred.withdrawAsync(coin5)];
                case 92:
                    _50.sent();
                    return [4 /*yield*/, harry.withdrawAsync(coin3)];
                case 93:
                    _50.sent();
                    return [4 /*yield*/, harry.withdrawAsync(coin1)];
                case 94:
                    _50.sent();
                    return [4 /*yield*/, harry.withdrawAsync(coin4)];
                case 95:
                    _50.sent();
                    _35 = (_34 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 96:
                    _35.apply(_34, [(_50.sent()).length, 8, 'Fred 6 coins']);
                    _37 = (_36 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin2)];
                case 97:
                    _37.apply(_36, [(_50.sent()).state, 0, 'Fred succesfully withdrew coin 2']);
                    _39 = (_38 = t).equal;
                    return [4 /*yield*/, fred.getPlasmaCoinAsync(coin5)];
                case 98:
                    _39.apply(_38, [(_50.sent()).state, 0, 'Fred succesfully withdrew coin 5']);
                    _41 = (_40 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin3)];
                case 99:
                    _41.apply(_40, [(_50.sent()).state, 0, 'Harry succesfully withdrew coin 3']);
                    _43 = (_42 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin4)];
                case 100:
                    _43.apply(_42, [(_50.sent()).state, 0, 'Harry succesfully withdrew coin 4']);
                    _45 = (_44 = t).equal;
                    return [4 /*yield*/, harry.getPlasmaCoinAsync(coin1)];
                case 101:
                    _45.apply(_44, [(_50.sent()).state, 0, 'Harry succesfully withdrew coin 1']);
                    _50.label = 102;
                case 102: return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 103:
                    if (!((_50.sent()).length != 6)) return [3 /*break*/, 105];
                    return [4 /*yield*/, config_1.sleep(2000)];
                case 104:
                    _50.sent();
                    return [3 /*break*/, 102];
                case 105: return [4 /*yield*/, harry.getUserCoinsAsync()];
                case 106:
                    if (!((_50.sent()).length != 0)) return [3 /*break*/, 108];
                    return [4 /*yield*/, config_1.sleep(2000)];
                case 107:
                    _50.sent();
                    return [3 /*break*/, 105];
                case 108:
                    _47 = (_46 = t).equal;
                    return [4 /*yield*/, fred.getUserCoinsAsync()];
                case 109:
                    _47.apply(_46, [(_50.sent()).length, 6, 'Withdraw oracle for fred OK']);
                    _49 = (_48 = t).equal;
                    return [4 /*yield*/, harry.getUserCoinsAsync()];
                case 110:
                    _49.apply(_48, [(_50.sent()).length, 0, 'Withdraw oracle for harry OK']);
                    config_1.disconnectAccounts(accounts);
                    t.end();
                    return [2 /*return*/];
            }
        });
    });
}
exports.complexDemo = complexDemo;
//# sourceMappingURL=complex-demo.js.map