const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const pkg = require('../package.json')

const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: true,
})

// http://webpack.github.io/docs/configuration.html
const config = {
  context: path.resolve(__dirname, '../src'),
  entry: [
    '@babel/polyfill',
    'whatwg-fetch',
  ],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    chunkFilename: '[name].bundle.js',
    sourcePrefix: '  ',
  },

  resolve: {
    alias: {
      components: path.resolve(__dirname, '../src/components/'),
      theme: path.resolve(__dirname, '../src/styles/theme.js'),
      utils: path.resolve(__dirname, '../src/utils/'),
      assets: path.resolve(__dirname, '../public/assets/'),
      styler: path.resolve(__dirname, '../src/styles/styler.js'),
      compose: path.resolve(__dirname, '../src/styles/compose.js'),
    },
  },

  // What information should be printed to the console
  stats: {
    colors: true,
    timings: true,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION || 'omnae'),
        API_URL: JSON.stringify(process.env.API_URL || 'http://localhost:9090'),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID || 'dUeE42A2aB9grdcVjVP5DD47aEHxYZ7R'),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN || 'INSERT_DOMAIN_HERE.auth0.com'),
        AUTH0_REDIRECT_URI: JSON.stringify(process.env.AUTH0_REDIRECT_URI || 'http://localhost:8080/callback'),
      },
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../public/dist'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      // https://jaketrent.com/post/load-both-css-and-css-modules-webpack/
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|webp)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        use: 'file-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
}

module.exports = config
