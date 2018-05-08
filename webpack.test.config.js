const path = require('path');
const WebpackTapeRun = require('webpack-tape-run');

module.exports = {
  mode: 'production',
  entry: './dist/tests/integration_test.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'browser_tests.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    library: 'loom_tests'
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
  plugins: [
    new WebpackTapeRun()
  ],
  // silence irrelevant messages
  performance: {
    hints: false
  },
  stats: 'errors-only'
};