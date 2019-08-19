"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var db_1 = require("../../../plasma-cash/db");
var plasma_cash_tx_1 = require("../../../plasma-cash/plasma-cash-tx");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
tape_1.default('Database', function (t) {
    var db = null;
    var db2 = null;
    try {
        db = new db_1.PlasmaDB('test');
        var slot = new bn_js_1.default('9fe41685a061deda', 16);
        var blkNumber = new bn_js_1.default('7d0', 16); // 2000
        var prevBlk = new bn_js_1.default('3e8', 16); // 1000
        var newOwner = '0x3d5cf1f50c7124acbc6ea69b96a912fe890619d0';
        var tx = new plasma_cash_tx_1.PlasmaCashTx({ slot: slot, prevBlockNum: prevBlk, denomination: 1, newOwner: newOwner });
        db.receiveCoin(slot, blkNumber, true, tx);
        var coinData = db.getCoin(slot);
        t.equal(coinData.length, 1, 'should receive the coin correctly');
        t.ok(coinData[0].slot.eq(slot), 'slots should be equal');
        // Simulate disconnecting and reconnecting
        db2 = new db_1.PlasmaDB('test');
        db2.receiveCoin(slot, blkNumber, true, tx);
        coinData = db2.getCoin(slot);
        t.equal(coinData.length, 1, 'should not add a duplicate coin');
        t.ok(coinData[0].slot.eq(slot), 'slots should be equal');
        var blkNumber2 = new bn_js_1.default('bb8', 16); // 3000
        var prevBlk2 = new bn_js_1.default('7d0', 16); // 2000
        var tx2 = new plasma_cash_tx_1.PlasmaCashTx({ slot: slot, prevBlockNum: prevBlk2, denomination: 1, newOwner: newOwner });
        db2.receiveCoin(slot, blkNumber2, true, tx2);
        coinData = db2.getCoin(slot);
        t.equal(coinData.length, 2, 'should receive the new coin');
        t.ok(coinData[1].slot.eq(slot), 'slots should be equal');
        var slot2 = new bn_js_1.default('325f4cae865afba7', 16);
        var tx3 = new plasma_cash_tx_1.PlasmaCashTx({ slot: slot, prevBlockNum: prevBlk, denomination: 1, newOwner: newOwner });
        db2.receiveCoin(slot2, blkNumber2, true, tx3);
        coinData = db2.getAllCoins();
        t.equal(coinData.length, 3, 'should receive the new coin');
        var slots = db2.getAllCoinSlots();
        t.ok(slots[0].eq(slot), 'slots should be equal');
        t.ok(slots[1].eq(slot2), 'slots should be equal');
        var tx_ret = db2.getTx(slot, blkNumber);
        t.deepEqual(tx, tx_ret, 'Retrieved tx should match the one initially set');
        db2.removeCoin(slot);
        coinData = db2.getAllCoins();
        t.equal(coinData.length, 1, 'should delete instances of the coin');
        slots = db2.getAllCoinSlots();
        t.ok(slots[0].eq(slot2), 'slots should be equal');
        db2.saveBlock(slot, blkNumber);
        db2.saveBlock(slot2, blkNumber);
        db2.saveBlock(slot, blkNumber2);
        var b = db2.getBlock(slot);
        t.ok(blkNumber2.eq(b), 'should be able to save block numbers');
        db2.saveLastBlock(blkNumber);
        t.ok(db2.getLastBlock().eq(blkNumber), 'should be able to save latest block number');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if (db) {
            db.delete();
        }
        if (db2) {
            db2.delete();
        }
    }
    t.end();
});
//# sourceMappingURL=database-tests.js.map