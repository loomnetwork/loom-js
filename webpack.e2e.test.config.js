// This config is used to run tests in the browser.

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
    // Be default tests will run in Electron, but can use other browsers too,
    // see https://github.com/syarul/webpack-tape-run for plugin settings.
    new WebpackTapeRun()
  ],
  // silence irrelevant messages
  performance: {
    hints: false
  },
  stats: 'errors-only'
};