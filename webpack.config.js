

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      path.join(__dirname, 'client/index.js')
    ],
    vendor: ['react', 'react-dom', 'react-relay', 'react-router', 'react-router-relay']
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      $: 'jquery',
      jQuery: 'jquery'
    }
  },
  devtool: process.env.devtool || 'source-map',
  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      loaders: ['react-hot', 'babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?[a-z0-9=\.]+)?$/,
      loader: 'url-loader?limit=30000&name=[hash].[ext]'
    }, {
      test: /\.module.scss$/,
      loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader', 'sass-loader']
    }, {
      test: /\.scss$/,
      exclude: /\.module/,
      loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    },{ 
      test: /(\.css$)/, loaders: ['style-loader', 'css-loader', 'postcss-loader'] 
    }]
  },
  postcss() {
    return [autoprefixer];
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'EXO Create',
      template: './client/index.html',
      mobile: true,
      inject: false
    })
  ]
};
