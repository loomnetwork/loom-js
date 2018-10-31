"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var mock_entity_1 = require("./mock-entity");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
tape_1.default('Entity', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var web3, params, entity, blks, expected, startBlock, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                web3 = new web3_1.default();
                params = { childBlockInterval: 1000 };
                entity = new mock_entity_1.MockEntity(web3, params);
                blks = void 0, expected = void 0, startBlock = void 0;
                startBlock = new bn_js_1.default(3);
                entity.currBlock = new bn_js_1.default(1000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 1:
                blks = _a.sent();
                expected = [new bn_js_1.default(3), new bn_js_1.default(1000)];
                t.deepEqual(blks, expected, 'blocks should match');
                startBlock = new bn_js_1.default(1000);
                entity.currBlock = new bn_js_1.default(2000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 2:
                blks = _a.sent();
                expected = [new bn_js_1.default(1000), new bn_js_1.default(2000)];
                t.deepEqual(blks, expected, 'blocks should match');
                startBlock = new bn_js_1.default(1000);
                entity.currBlock = new bn_js_1.default(3000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 3:
                blks = _a.sent();
                expected = [new bn_js_1.default(1000), new bn_js_1.default(2000), new bn_js_1.default(3000)];
                t.deepEqual(blks, expected, 'blocks should match');
                startBlock = new bn_js_1.default(1003);
                entity.currBlock = new bn_js_1.default(1000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 4:
                blks = _a.sent();
                expected = [new bn_js_1.default(1003)];
                t.deepEqual(blks, expected, 'blocks should match');
                startBlock = new bn_js_1.default(5000);
                entity.currBlock = new bn_js_1.default(5000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 5:
                blks = _a.sent();
                expected = [new bn_js_1.default(5000)];
                t.deepEqual(blks, expected);
                startBlock = new bn_js_1.default(1003);
                entity.currBlock = new bn_js_1.default(5000);
                return [4 /*yield*/, entity.getBlockNumbersAsync(startBlock)];
            case 6:
                blks = _a.sent();
                expected = [new bn_js_1.default(1003), new bn_js_1.default(2000), new bn_js_1.default(3000), new bn_js_1.default(4000), new bn_js_1.default(5000)];
                t.deepEqual(blks, expected);
                return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 8];
            case 8:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=entity-tests.js.map