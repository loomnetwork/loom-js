"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var web3_1 = tslib_1.__importDefault(require("web3"));
// TODO: web3 type defs aren't very good, need to clean them up
var web3 = new web3_1.default();
// TODO: the hashing function should be passed into the constructor to avoid a direct dependency on web3
function soliditySha3() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var _a;
    return (_a = web3.utils).soliditySha3.apply(_a, values);
}
// TODO: can probably just use `new BN()` instead
function toBigNumber(value) {
    return web3.utils.toBN(value);
}
var SparseMerkleTree = /** @class */ (function () {
    /**
     *
     * @param depth Number of levels in the tree.
     * @param leaves A dictionary with key as the leaf's slot and value the leaf's hash.
     */
    function SparseMerkleTree(depth, leaves) {
        this.depth = depth;
        this.leaves = leaves;
        // Initialize defaults
        var defaultNodes = this._createDefaultNodes(depth);
        if (leaves && Object.keys(leaves).length !== 0) {
            this.tree = this._createTree(this.leaves, this.depth, defaultNodes);
            this.root = this.tree[this.depth]['0'];
        }
        else {
            this.tree = [];
            this.root = defaultNodes[this.depth];
        }
    }
    SparseMerkleTree.prototype._createDefaultNodes = function (depth) {
        var defaultNodes = new Array(depth + 1);
        defaultNodes[0] = soliditySha3(0);
        for (var i = 1; i < depth + 1; i++) {
            defaultNodes[i] = soliditySha3(defaultNodes[i - 1], defaultNodes[i - 1]);
        }
        return defaultNodes;
    };
    SparseMerkleTree.prototype._createTree = function (orderedLeaves, depth, defaultNodes) {
        var tree = [orderedLeaves];
        var treeLevel = orderedLeaves;
        var nextLevel = {};
        var halfIndex;
        var value;
        for (var level = 0; level < depth; level++) {
            nextLevel = {};
            for (var index in treeLevel) {
                halfIndex = toBigNumber(index)
                    .div(new bn_js_1.default(2))
                    .toString();
                value = treeLevel[index];
                if (toBigNumber(index)
                    .mod(new bn_js_1.default(2))
                    .isZero()) {
                    var coIndex = toBigNumber(index)
                        .add(new bn_js_1.default(1))
                        .toString();
                    nextLevel[halfIndex] = soliditySha3(value, treeLevel[coIndex] || defaultNodes[level]);
                }
                else {
                    var coIndex = toBigNumber(index)
                        .sub(new bn_js_1.default(1))
                        .toString();
                    if (treeLevel[coIndex] === undefined) {
                        nextLevel[halfIndex] = soliditySha3(defaultNodes[level], value);
                    }
                }
            }
            treeLevel = nextLevel;
            tree.push(treeLevel);
        }
        return tree;
    };
    SparseMerkleTree.prototype.createMerkleProof = function (slot) {
        var index = toBigNumber(slot);
        var proof = '';
        var proofbits = new bn_js_1.default(0);
        for (var level = 0; level < this.depth; level++) {
            var siblingIndex = index.mod(new bn_js_1.default(2)).eq(new bn_js_1.default(0))
                ? index.add(new bn_js_1.default(1))
                : index.sub(new bn_js_1.default(1));
            index = index.div(new bn_js_1.default(2));
            var siblingHash = this.tree[level][siblingIndex.toString()];
            if (siblingHash) {
                proof += siblingHash.replace('0x', '');
                proofbits = proofbits.bincn(level);
            }
        }
        var buf = proofbits.toBuffer('be', 8);
        var total = Buffer.concat([buf, Buffer.from(proof, 'hex')]);
        return '0x' + total.toString('hex');
    };
    return SparseMerkleTree;
}());
exports.SparseMerkleTree = SparseMerkleTree;
//# sourceMappingURL=sparse-merkle-tree.js.map