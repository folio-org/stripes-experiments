#!/bin/sh

set -e

#github_url="ssh://git@github.com/sling-incubator/stripes-experiments"
: ${github_url="$(pwd)"} 

aws_s3_path="folio-ui-bundle/tenant"
aws_url="https://s3.amazonaws.com/$aws_s3_path"

: ${ui_url="https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wosch.tgz"}
: ${stripes_branch="wosch"}
: ${stripes_tenant="wosch"}


echo "node version: $(node --version)"
echo "npm  version: $(npm --version)"

dir=$(mktemp -d /tmp/stripe.XXXXXXXX)

cd $dir
pwd 
git clone -q $github_url
cd $(basename $github_url)

if [ -n "$stripes_branch" ]; then
   if ! git branch | egrep -q wosch; then
     git checkout -b $stripes_branch origin/$stripes_branch
   fi
fi

time=$(perl -e 'print time')
bundle_dir="$stripes_tenant-$time"

( cd stripes-core
rm -rf $bundle_dir
mkdir $bundle_dir
curl -sSf -o $bundle_dir/favicon.ico https://www.folio.org/wp-content/themes/folio/img/FIO_fav.png 
)

env STRIPE_STATIC=/$aws_s3_path/$bundle_dir \
  perl -i.bak -npe "s,(publicPath:)\s*'/static/',\$1 '\$STRIPE_STATIC'," \
  stripes-core/webpack.config.tenant.js

############################
# main
#
./install.sh

# add new UI module to bundle
wget $ui_url
tar xfz $(basename $ui_url)

cd stripes-core && npm --silent run build:tenant
pwd


cp index.html $bundle_dir
rsync -a static $bundle_dir

aws s3 sync --quiet $bundle_dir s3://$aws_s3_path/$bundle_dir

echo $aws_url/$bundle_dir/index.html

