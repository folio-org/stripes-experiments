// Base Webpack configuration for building Stripes at the command line,
// including Stripes configuration.

const path = require('path');
const webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  stripesLoader: {
    okapi: { 'url':'http://localhost:9130' },
    modules: {
      '@folio-sample-modules/trivial': {},
      '@folio-sample-modules/trivial-okapi': {},
      '@folio-sample-modules/okapi-console': {},
      '@folio-sample-modules/patrons': {}

    }
  }
};
