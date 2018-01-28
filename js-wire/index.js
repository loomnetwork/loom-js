function xport(exports, m) {
  for (var key in m) {
    exports[key] = m[key];
  }
}

function compare(arrA, arrB) {
  var min = Math.min(arrA.length, arrB.length);
  for (var i = 0; i < min; i++) {
    if (arrA[i] < arrB[i]) {
      return -1;
    }
    if (arrA[i] > arrB[i]) {
      return 1;
    }
  }
  if (arrA.length < arrB.length) {
    return -1;
  }
  if (arrA.length > arrB.length) {
    return 1;
  }
  return 0;
}

module.exports = {
  compare: compare,
};
xport(module.exports, require('./reader'));
xport(module.exports, require('./writer'));
require('./bytearray'); // extends Reader/Writer
