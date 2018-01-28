var Reader = require('./reader').Reader;
var Writer = require('./writer').Writer;

Reader.prototype.readByteArray = function() {
  var length = this.readUvarint();
  var buf = new Uint8Array(length);
  for (var i = 0; i < length; i += 1) {
    var b = this.readByte();
    buf[i] = b;
  }
  return new Buffer(buf);
}

Writer.prototype.writeByteArray = function(v) {
  var length = v.length;
  this.writeUvarint(length);
  for (var i = 0; i < length; i++) {
    var b = v[i];
    this.writeByte(b);
  }
}
