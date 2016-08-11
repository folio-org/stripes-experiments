#!/bin/sh
#
# requires ssh github access. If you don't have credentials, use
# the script ./bin/install-nexus.sh 
#

# fail on error
set -e

(
cd redux-okapi 
npm install
)

(
cd stripes-core
npm install
)

(
cd stripes-core/node_modules/stripes-loader
npm install
npm run build
)

(
cd stripes-core/node_modules
if [ ! -e "@stripes-experiments" ]; then
  ln -fs ../.. @stripes-experiments
fi
)

echo ""
echo "now start for dev:"
echo "cd stripes-core && npm start"
echo "  or for build"
echo "cd stripes-core && npm run build"

