"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var entity_1 = require("../../../plasma-cash/entity");
var MockEntity = /** @class */ (function (_super) {
    tslib_1.__extends(MockEntity, _super);
    function MockEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockEntity.prototype.getCurrentBlockAsync = function () {
        var _this = this;
        return new Promise(function (resolve, err) { return resolve(_this.currBlock); });
    };
    return MockEntity;
}(entity_1.Entity));
exports.MockEntity = MockEntity;
//# sourceMappingURL=mock-entity.js.map