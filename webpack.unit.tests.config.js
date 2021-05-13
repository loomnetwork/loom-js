// This config is used to run tests in the browser.

const path = require('path');
const WebpackTapeRun = require('webpack-tape-run');

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './dist/tests/unit_tests.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'browser_unit_tests.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    library: 'loom_unit_tests'
  },
  node: {
    fs: 'empty',
    crypto: true,
    util: true,
    stream: true,
    path: 'empty',
  },
  externals: {
    shelljs: 'commonjs shelljs',
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
