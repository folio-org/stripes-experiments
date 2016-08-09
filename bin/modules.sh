#!/bin/sh

data=""
for module in $@
do
    m=$(basename $module ".tgz")
    if [ -z "$data" ]; then
	data="'@stripes-experiments/$m': {}"
    else
	data=$(printf "$data,\n\t%s" "'@stripes-experiments/$m': {}")
    fi
done


cat <<EOF;

// Base Webpack configuration for building Stripes at the command line,
// including Stripes configuration.

const path = require('path');
const webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: 'static/'
  },
  stripesLoader: {
    okapi: { 'url':'http://localhost:9130' },
    modules: {
	$data
    }
  }
};

EOF

