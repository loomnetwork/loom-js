var assert = require('assert');

/*
  Usage:
  var buf = new Buffer(<some_hex_string>, 'hex');
  var r = new Reader(buf);
  console.log(r.readUvarint());
  ...
*/

var Reader = function(buf) {
  if (Buffer.isBuffer(buf)) {
    this.buf = buf;
  } else {
    this.buf = new Buffer(buf);
  }
  this.offset = 0;
}

Reader.prototype.readInt8 = function() {
  var v = this.buf.readInt8(this.offset);
  this.offset += 1;
  return v;
}

Reader.prototype.readUint8 = function() {
  var v = this.buf.readUInt8(this.offset);
  this.offset += 1;
  return v;
}

Reader.prototype.readByte = Reader.prototype.readUint8;

Reader.prototype.readInt16 = function() {
  var v = this.buf.readInt16BE(this.offset);
  this.offset += 2;
  return v;
}

Reader.prototype.readUint16 = function() {
  var v = this.buf.readUInt16BE(this.offset);
  this.offset += 2;
  return v;
}

Reader.prototype.readInt32 = function() {
  var v = this.buf.readInt32BE(this.offset);
  this.offset += 4;
  return v;
}

Reader.prototype.readUint32 = function() {
  var v = this.buf.readUInt32BE(this.offset);
  this.offset += 4;
  return v;
}

Reader.prototype.readInt64 = function() {
  throw 'not yet implemented'
}

Reader.prototype.readUint64 = function() {
  var a = this.buf.readUInt32BE(this.offset);
  var b = this.buf.readUInt32BE(this.offset + 4);
  a *= 0x100000000;
  this.offset += 8;
  verifuint(a + b, 0x001FFFFFFFFFFFFF);
  return a + b;
}

Reader.prototype.readVarint = function() {
  throw 'not yet implemented'
}

Reader.prototype.readUvarint = function() {
  var vLen = this.readUint8();
  var v = 0;
  for (var i = 0; i < vLen; i++) {
    var next = this.readUint8();
    v = v * 256 + next;
  }
  verifuint(v, 0x001FFFFFFFFFFFFF);
  return v;
}

Reader.prototype.readString = function() {
  var length = this.readUvarint();
  var v = this.buf.toString('utf8', this.offset, this.offset + length);
  this.offset += length;
  return v;
}

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value >= 0, 'specified a negative value for writing an unsigned value');
  assert(value <= max, 'value is larger than maximum value for type');
  assert(Math.floor(value) === value, 'value has a fractional component');
}

//--------------------------------------------------------------------------------

module.exports = {
  Reader: Reader,
};
