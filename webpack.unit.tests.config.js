// This config is used to run tests in the browser.

const path = require('path');
const WebpackTapeRun = require('webpack-tape-run');

module.exports = {
  mode: 'production',
  target: "web",
  entry: './dist/tests/unit_tests.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'browser_unit_tests.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    // library: 'loom_unit_tests'
  },
  node: {
    fs: 'empty',
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
        loader: 'babel-loader',
        options:
        {
          presets: [
            ['@babel/preset-env', { loose: true, modules: false }],
          ],
          sourceType: 'unambiguous'
        }
      }
    ]
  },
  plugins: [
  ],
  // silence irrelevant messages
  performance: {
    hints: false
  },
  stats: 'errors-only'
};
