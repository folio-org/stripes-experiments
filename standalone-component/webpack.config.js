const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

if (process.argv.length < 3) {
  console.log('Please provide the component to load as an argument to devServer.js');
  process.exit(1);
}

module.exports = {
  // devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin( {
      'COMPONENT_TO_TEST': JSON.stringify(process.argv[2]),
      'OKAPI_URL': JSON.stringify('http://localhost:9130')
    } ),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from:"node_modules/bootstrap/dist", to:"bootstrap"},
    ])
  ],
  resolve: {
    fallback: [
      path.resolve('src'),
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/@folio')
    ]
  },
  resolveLoader: {
    fallback: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/@folio')
    ]
  },
  postcss(webpack) {
    return [
      require('postcss-import')({addDependencyTo: webpack}),
      require('postcss-url'),
      require('postcss-cssnext')
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
        //include:  [path.join(__dirname, 'index.js'), /stripes-connect/, /@folio/]
        exclude: [/node_modules/]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[local]---[hash:base64:5]!postcss'
      }
    ]
  }
};
