"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var lowdb_1 = tslib_1.__importDefault(require("lowdb"));
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var debugLog = debug_1.default('plasma-cash:db');
var errorLog = debug_1.default('plasma-cash:db:error');
var PlasmaDB = /** @class */ (function () {
    function PlasmaDB(dbPath) {
        // TODO: the db path shouldn't be hardcoded
        // If we're on node.js
        var adapter;
        if (typeof localStorage === 'undefined' || localStorage === null) {
            var FileSync = require('lowdb/adapters/FileSync');
            var shelljs = require('shelljs');
            if (dbPath) {
                this.dbPath = dbPath;
            }
            else {
                this.dbPath = "./db/db.json";
            }
            if (!fs_1.default.existsSync(this.dbPath)) {
                shelljs.mkdir('-p', path_1.default.dirname(this.dbPath));
            }
            adapter = new FileSync(this.dbPath);
        }
        else {
            var LocalStorage = require('lowdb/adapters/LocalStorage');
            this.dbPath = 'db';
            adapter = new LocalStorage(this.dbPath);
        }
        this.db = lowdb_1.default(adapter);
        // Initialize the database
        this.db
            .defaults({
            coins: [],
            blocks: {},
            lastBlock: new bn_js_1.default(0)
        })
            .write();
        debugLog('Initialized database', this.db.value());
    }
    PlasmaDB.prototype.receiveCoin = function (coinId, block, included, tx) {
        // Find the coin in the database and add the block/proof.
        // Throw for duplicate block
        if (this.exists(coinId, block)) {
            return;
        }
        // @ts-ignore
        tx.proofBytes = Array.from(tx.proofBytes ? tx.proofBytes : [0, 0, 0, 0, 0, 0, 0, 0]);
        // @ts-ignore
        tx.sigBytes = Array.from(tx.sigBytes ? tx.sigBytes : 0);
        // Append for new coinId
        var result = this.db
            .get('coins')
            .push({
            slot: coinId,
            block: block,
            included: included,
            tx: tx
        })
            .write();
        debugLog('State updated', result);
    };
    PlasmaDB.prototype.saveLastBlock = function (block) {
        var result = this.db.set("lastBlock", block).write();
    };
    PlasmaDB.prototype.getLastBlock = function () {
        var result = this.db.get("lastBlock").value();
        return result;
    };
    // Get the block at which the owner received the coin
    PlasmaDB.prototype.saveBlock = function (coinId, block) {
        var result = this.db.set("blocks." + coinId, block).write();
    };
    PlasmaDB.prototype.getBlock = function (coinId) {
        var result = this.db.get("blocks." + coinId).value();
        return result;
    };
    PlasmaDB.prototype.getTx = function (coinId, block) {
        var result = this.db
            .get('coins')
            .filter(function (c) { return new bn_js_1.default(c.slot, 16).eq(coinId) && new bn_js_1.default(c.block, 16).eq(block); })
            .value();
        var tx = result[0].tx;
        return new plasma_cash_tx_1.PlasmaCashTx({
            slot: new bn_js_1.default(tx.slot, 16),
            prevBlockNum: new bn_js_1.default(tx.prevBlockNum, 16),
            denomination: new bn_js_1.default(1),
            newOwner: tx.newOwner,
            prevOwner: tx.prevOwner,
            sig: Uint8Array.from(tx.sigBytes),
            proof: Uint8Array.from(tx.proofBytes)
        });
    };
    PlasmaDB.prototype.exists = function (coinId, block) {
        var result = this.db
            .get('coins')
            .filter(function (c) { return new bn_js_1.default(c.slot, 16).eq(coinId) && new bn_js_1.default(c.block, 16).eq(block); })
            .value();
        if (result.length > 0) {
            debugLog("Transaction: " + coinId + " at Block: " + block + " already exists in local state");
            return true;
        }
        else {
            return false;
        }
    };
    PlasmaDB.prototype.removeCoin = function (coinId) {
        this.db
            .get('coins')
            .remove(function (c) { return new bn_js_1.default(c.slot, 16).eq(coinId); })
            .write();
        debugLog("Coin " + coinId + " removed");
    };
    PlasmaDB.prototype.getCoin = function (coinId) {
        var _this = this;
        // The first time we write to the database we have to filter wihtout toString(16)
        var coins = this.db
            .get('coins')
            .filter(function (c) { return new bn_js_1.default(c.slot, 16).eq(coinId); })
            .value();
        return coins.map(function (c) { return _this.marshalDBCoin(c); });
    };
    PlasmaDB.prototype.getAllCoins = function () {
        var _this = this;
        return this.db
            .get('coins')
            .value()
            .map(function (c) { return _this.marshalDBCoin(c); });
    };
    PlasmaDB.prototype.getAllCoinSlots = function () {
        var coins = this.getAllCoins();
        // Get unique keys, O(N) complexity, can't go lower
        var flag = {};
        var distinct = [];
        for (var i in coins) {
            if (flag[coins[i].slot])
                continue;
            distinct.push(coins[i].slot);
            flag[coins[i].slot] = true;
        }
        return distinct;
    };
    PlasmaDB.prototype.marshalDBCoin = function (c) {
        return {
            slot: new bn_js_1.default(c.slot, 16),
            included: c.included,
            blockNumber: new bn_js_1.default(c.block, 16),
            tx: new plasma_cash_tx_1.PlasmaCashTx({
                slot: new bn_js_1.default(c.tx.slot, 16),
                prevBlockNum: new bn_js_1.default(c.tx.prevBlockNum, 16),
                denomination: new bn_js_1.default(c.tx.denomination, 16),
                newOwner: c.tx.newOwner,
                sig: c.tx.sigBytes,
                proof: c.tx.proofBytes
            })
        };
    };
    /** Reclaims any space used by the database */
    PlasmaDB.prototype.delete = function () {
        if (typeof localStorage === 'undefined' || localStorage === null) {
            if (fs_1.default.existsSync(this.dbPath)) {
                fs_1.default.unlinkSync(this.dbPath);
                try {
                    // this will throw an error if the directory isn't empty
                    fs_1.default.rmdirSync(path_1.default.dirname(this.dbPath));
                }
                catch (err) {
                    errorLog(err);
                }
            }
        }
        else {
            localStorage.removeItem(this.dbPath);
        }
    };
    return PlasmaDB;
}());
exports.PlasmaDB = PlasmaDB;
//# sourceMappingURL=db.js.map