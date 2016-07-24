#!/bin/sh

set -e
pwd=$(pwd)

#github_url="ssh://git@github.com/sling-incubator/stripes-experiments"
: ${github_url="$(pwd)"} 

aws_s3_path="folio-ui-bundle/tenant"
aws_url="https://s3.amazonaws.com/$aws_s3_path"

: ${ui_url="https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wosch.tgz"}
: ${stripes_branch="wolfram"}
: ${stripes_tenant="wolfram"}
: ${stripes_debug=false}


echo "node version: $(node --version)"
echo "npm  version: $(npm --version)"

tmp=/tmp
if [ -n "$TMPDIR" ]; then
  tmp=$TMPDIR
fi
dir=$(mktemp -d $tmp/stripe.XXXXXXXX)

cd $dir
pwd 
git clone -q $github_url
cd $(basename $github_url)

if [ -n "$stripes_branch" ]; then
   if ! git branch | egrep -q $stripes_branch; then
     git checkout -b $stripes_branch origin/$stripes_branch
   fi
fi

time=$(perl -e 'print time')
bundle_dir="$stripes_tenant-$time"

( 
cd stripes-core
rm -rf $bundle_dir
mkdir $bundle_dir
curl -sSf -o $bundle_dir/favicon.ico https://www.folio.org/wp-content/themes/folio/img/FIO_fav.png 
)


./bin/modules.pl $ui_url > stripes-core/webpack.config.tenant.js

############################
# main
#
#./bin/install.sh
./bin/install-nexus.sh

# add new UI module to bundle
for url in $ui_url
do 
  # a directory, just copy
  if [ -d $pwd/$url ]; then
    rsync -a $pwd/$url .

  # fetch from web site
  else
    wget $url
    tar xfz $(basename $url)
  fi
done

cd stripes-core && npm --silent run build:tenant

cp index.html $bundle_dir
rsync -a static $bundle_dir

aws s3 sync --quiet $bundle_dir s3://$aws_s3_path/$bundle_dir

echo $aws_url/$bundle_dir/index.html

# cleanup temp space
if $stripes_debug; then
  pwd
else
  rm -rf $dir
fi

