#!/bin/sh

# fail on error
set -e

(
cd redux-okapi 
npm install
)

(
mkdir -p stripes-core/node_modules && \
   cd stripes-core/node_modules/ && \
   rm -rf stripes-loader && \
   rm -rf stripes-loader-[0-9]* && \
   wget https://s3.amazonaws.com/folio-ui-bundle/tarball/stripes-loader-0.0.0-nogit.tgz && \
   tar xfz stripes-loader-0.0.0-nogit.tgz && \
   perl -i.bak -npe 's/^\s*"stripes-loader"\s*:.*\n//' ../package.json
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

echo ""
echo "now start for webpack dev:"
echo "( cd stripes-core && npm run start:webpack )"

