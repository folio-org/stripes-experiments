#!/bin/bash

set -e
pwd=$(pwd)

#github_url="ssh://git@github.com/sling-incubator/stripes-experiments"
: ${github_url="$(pwd)"} 

: ${aws_s3_path="folio-ui-bundle/tenant"}
aws_url="http://s3.amazonaws.com/$aws_s3_path"

: ${ui_url="https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz"}
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
if [[ $(uname -s) =~ CYGWIN.* ]]; then
    github_url="${github_url/\//\\}"
fi
git clone -q "$github_url"
cd $(basename "$github_url")

if [ -n "$stripes_branch" ]; then
    if ! git branch | egrep -q $stripes_branch; then
        git checkout -b $stripes_branch origin/$stripes_branch
    fi
fi

if ! echo $stripes_tenant | egrep -q -i '^[a-z0-9_-]+$'; then
    echo "illegal tenant name: [A-Za-z0-9_-]: $tenant"
    exit 1
fi

time=$(date '+%s')
bundle_dir="$stripes_tenant-$time"

( 
cd stripes-core
rm -rf $bundle_dir
mkdir $bundle_dir
cp favicon.ico  $bundle_dir
)


./bin/modules.sh $ui_url > stripes-core/webpack.config.tenant.js

# GNU tar needs special options
if tar --help| egrep -w -- --wildcards >/dev/null; then
    tar_opt=--wildcards
fi

############################
# main
#
# add new UI module to bundle
for url in $ui_url
do 
    # a directory, just copy
    if [ -d "$pwd/$url" ]; then
        if echo $url | egrep -q -i '^[a-z0-9_-]+$'; then
            rsync -a "$pwd/$url" .
            (cd $(basename $url) && pwd && npm install )
        else
            echo "illegal directory path: [A-Za-z0-9_-]: $url"
            exit 1
        fi

    # fetch from web site
    else
        if echo $url | egrep -q -i '^https?://[a-z0-9]+\S+$'; then
            wget -q $url
            tar $tar_opt -xzf $(basename $url) '[a-zA-Z0-9]*'
            (cd $(basename $url .tgz) && npm install )
        else
            echo "illegal URL: $url"
            exit 1
        fi
    fi
done

# re-use installed node_modules
if [ -d "$pwd/stripes-core/node_modules" ]; then
    rsync -a "$pwd/stripes-core/node_modules" stripes-core
fi

#./bin/install.sh
env interactive="" ./bin/install-nexus.sh

cd stripes-core && npm run build:tenant

cp index.html $bundle_dir
rsync -a static $bundle_dir

if aws s3 sync --quiet $bundle_dir s3://$aws_s3_path/$bundle_dir; then
    echo $aws_url/$bundle_dir/index.html
else
    echo "Upload to $aws_url failed, please check your ~/.aws setup"
    exit 1
fi

# cleanup temp space
if $stripes_debug; then
    pwd
else
    rm -rf $dir &
fi

