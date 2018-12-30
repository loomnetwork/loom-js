"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var crypto_utils_1 = require("./crypto-utils");
var loom_pb_1 = require("./proto/loom_pb");
function unmarshalBigUIntPB(value) {
    var bytes = value.getValue_asU8();
    var buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return new bn_js_1.default(buf, 10, 'be');
}
exports.unmarshalBigUIntPB = unmarshalBigUIntPB;
function marshalBigUIntPB(value) {
    var buf = value.toArrayLike(Buffer, 'be');
    var pb = new loom_pb_1.BigUInt();
    pb.setValue(crypto_utils_1.bufferToProtobufBytes(buf));
    return pb;
}
exports.marshalBigUIntPB = marshalBigUIntPB;
//# sourceMappingURL=big-uint.js.map