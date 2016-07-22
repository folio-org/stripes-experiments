#!/usr/bin/perl

use File::Basename;

use strict;
use warnings;

my @data;

foreach my $module (@ARGV) {
    my $m = basename( $module, ".tgz" );
    push @data, qq['\@stripes-experiments/'$m': {}'];
}

print join ",\n", @data;

