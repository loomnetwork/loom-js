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
    child_process: 'empty',
    crypto: true,
    util: true,
    stream: true,
    path: 'empty',
  },
  externals: {
    ethers: 'ethers',
    shelljs: 'shelljs',
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
