// Common Webpack configuration for building Stripes

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    './src/index'
  ],
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
        // On MS Windows:
        //  ENABLE the below 'include' and DISABLE the 'exclude' if you followed
        //  the README.md on how to install stripes-experiments on platforms
        //  without symlink support
        //
        // include:  [path.join(__dirname, 'src'), /@stripes-experiments/]
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
