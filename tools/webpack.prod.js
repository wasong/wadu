const merge = require('webpack-merge')
const Terser = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const common = require('./webpack.common')

// http://webpack.github.io/docs/configuration.html
const config = {
  mode: 'production',
  entry: [
    './main.js',
  ],
  optimization: {
    usedExports: true,
    noEmitOnErrors: true,
    minimizer: [
      new Terser({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  // Options affecting the output of the compilation
  output: {
    publicPath: '/dist/',
    filename: '[name].[hash].js',
  },
  devtool: 'source-map',
}

module.exports = merge(common, config)
