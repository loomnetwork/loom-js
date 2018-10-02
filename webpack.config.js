// This config is used for the browser build of loom-js.

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'loom.umd.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    library: 'loom'
  },
  node: {
    fs: 'empty',
    crypto: true,
    util: true,
    stream: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      }
    ]
  },
};
