const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const config = {
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './main.js',
  ],
  // Options affecting the output of the compilation
  output: {
    publicPath: `http://localhost:${process.env.PORT || 8080}/dist/`,
    filename: '[name].js?[hash]',
  },
  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: 'cheap-module-eval-source-map',
  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },
}

module.exports = merge(common, config)
