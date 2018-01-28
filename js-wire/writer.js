var assert = require('assert');

/*
  Usage:
  var w = new Writer();
  w.writeUvarint(123);
  ...
*/

var Writer = function(buf) {
  if (typeof buf == 'undefined') {
    buf = new Buffer(1024);
  }
  this.buf = buf;
  this.offset = 0;
}

Writer.prototype.getBuffer = function() {
  return this.buf.slice(0, this.offset);
}

Writer.prototype.ensureBuf = function(needBytes) {
  if (this.buf.length < this.offset + needBytes) {
    var newBuf = new Buffer(this.buf.length + 1024);
    this.buf = Buffer.concat([this.buf, newBuf]);
  }
}

Writer.prototype.writeInt8 = function(v) {
  this.ensureBuf(1);
  this.buf.writeInt8(v, this.offset);
  this.offset += 1;
}

Writer.prototype.writeUint8 = function(v) {
  this.ensureBuf(1);
  this.buf.writeUInt8(v, this.offset);
  this.offset += 1;
}

Writer.prototype.writeByte = Writer.prototype.writeUint8;

Writer.prototype.writeInt16 = function(v) {
  this.ensureBuf(2);
  this.buf.writeInt16BE(v, this.offset);
  this.offset += 2;
}

Writer.prototype.writeUint16 = function(v) {
  this.ensureBuf(2);
  this.buf.writeUInt16BE(v, this.offset);
  this.offset += 2;
}

Writer.prototype.writeInt32 = function(v) {
  this.ensureBuf(4);
  this.buf.writeInt32BE(v, this.offset);
  this.offset += 4;
}

Writer.prototype.writeUint32 = function(v) {
  this.ensureBuf(4);
  this.buf.writeUInt32BE(v, this.offset);
  this.offset += 4;
}

Writer.prototype.writeInt64 = function(v) {
  throw 'not yet implemented';
}

Writer.prototype.writeUint64 = function(v) {
  this.ensureBuf(8);
  verifuint(v, 0x001FFFFFFFFFFFFf);
  this.buf.writeUInt32BE(Math.floor(v / 0x100000000), this.offset);
  this.buf.writeInt32BE(v & -1, this.offset + 4); // Nice trick.
  this.offset += 8;
}

function uvarintSize(i) {
  verifuint(i, 0x001FFFFFFFFFFFFf);
  return i < 0x100 ? 1
    : i < 0x0000000000010000 ? 2
      : i < 0x0000000001000000 ? 3
        : i < 0x0000000100000000 ? 4
          : i < 0x0000010000000000 ? 5
            : i < 0x0001000000000000 ? 6
              : i < 0x0100000000000000 ? 7
                : 8;
}

Writer.prototype.writeVarint = function(v) {
  throw 'not yet implemented';
}

Writer.prototype.writeUvarint = function(v) {
  var vLen = uvarintSize(v);
  this.writeUint8(vLen);
  var bytes = [];
  for (var i = 0; i < vLen; i++) {
    var remainder = v % 256;
    bytes.push(remainder);
    v = (v - remainder) / 256;
  }
  for (var i = 0; i < vLen; i++) {
    this.writeUint8(bytes[vLen - i - 1]);
  }
}

Writer.prototype.writeString = function(v) {
  this.writeUvarint(v.length);
  var utf8Buf = new Buffer(v, 'utf8');
  if (this.buf.length - this.offset >= utf8Buf.length) {
    for (var i = 0; i < utf8Buf.length; i++) {
      this.buf[this.offset+i] = utf8Buf[i];
    }
    this.offset += utf8Buf.length;
  } else {
    this.buf = Buffer.concat([this.buf, utf8Buf]);
    this.offset += utf8Buf.length;
  }
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
  Writer: Writer,
  uvarintSize: uvarintSize,
};

