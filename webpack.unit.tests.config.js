// This config is used to run tests in the browser.

const path = require('path')

module.exports = {
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
    path: 'empty'
  },
  externals: {
    shelljs: 'commonjs shelljs'
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
  // silence irrelevant messages
  performance: {
    hints: false
  },
  stats: 'errors-only'
}
