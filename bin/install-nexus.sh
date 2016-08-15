#!/bin/sh

# fail on error
set -e

: ${interactive="yes"}

(
cd stripes-connect
npm install
)

(
mkdir -p stripes-core/node_modules && \
   cd stripes-core/node_modules/ && \
   rm -rf stripes-loader && \
   rm -rf stripes-loader-[0-9]* && \
   wget -q https://s3.amazonaws.com/folio-ui-bundle/tarball/stripes-loader-0.0.0-nogit.tgz && \
   tar xfz stripes-loader-0.0.0-nogit.tgz && \
   sed -i.bak -e 's/^[ \t]*"stripes-loader"[ \t]*:.*//' ../package.json
)

(
cd stripes-core
npm install
)

(
cd stripes-core/node_modules
if [ ! -e "@stripes-experiments" ]; then
  ln -fs ../.. @stripes-experiments
fi
)

if [ "$interactive" = "yes" ]; then
    echo ""
    echo "now start the webpack service with: node stripes-core/webpackServer.js"
fi
#echo "( cd stripes-core && npm run start:webpack )"

