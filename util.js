// https://gist.github.com/tauzen/3d18825ae41ff3fc8981
export function bytesToHex(uint8arr) {
  if (!uint8arr) {
    return '';
  }
  
  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }
  
  return hexStr.toUpperCase();
}

export function hexToBytes(str) {
  if (!str) {
    return new Uint8Array();
  }
  
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }
  
  return new Uint8Array(a);
}

export class Writer {
  constructor(capacity) {
    this.buf = new Buffer(capacity);
    this.offset = 0;
  }

  ensureBuf(needBytes) {
    if (this.buf.length < this.offset + needBytes) {
      var newBuf = new Buffer(this.buf.length + 1024);
      this.buf = Buffer.concat([this.buf, newBuf]);
    }
  }

  write(str) {
    this.offset += this.buf.write(str);
  }

  writeUInt8(b) {
    this.offset = this.buf.writeUInt8(b, this.offset);
  }

  get buffer() {
    return this.buf.slice(0, this.offset);
  }
}
