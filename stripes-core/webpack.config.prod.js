const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const base = require('./webpack.config.base');
const cli = require('./webpack.config.cli');

module.exports = Object.assign({}, base, cli, {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("global.css", {
      allChunks: true
    }),
    new CopyWebpackPlugin([
      { from:"node_modules/bootstrap/dist", to:"bootstrap"},
    ])
  ]
});
