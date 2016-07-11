const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    fallback: [
      path.resolve('src'),
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/@stripes-experiments')
    ]
  },
  resolveLoader: {
    fallback: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/@stripes-experiments')
    ]
  },
  sassLoader: {
    sourceMap: true,
    indentedSyntax: true,
    outputStyle: 'expanded',
    includePaths: [
      'node_modules/bourbon/app/assets/stylesheets'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: [
              require.resolve("babel-preset-es2015"),
              require.resolve("babel-preset-stage-0"),
              require.resolve("babel-preset-react")
          ]
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader")
      }
    ]
  }
};
