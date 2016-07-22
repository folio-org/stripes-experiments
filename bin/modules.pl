#!/usr/bin/perl

use File::Basename;

use strict;
use warnings;

my @data;

foreach my $module (@ARGV) {
    my $m = basename( $module, ".tgz" );
    push @data, qq['\@stripes-experiments/$m': {}];
}

my $data = join ",\n\t", @data;

print <<EOF;

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

