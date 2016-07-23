#!/bin/sh
#
# requires ssh github access. If you don't have credentials, use
# the script ./bin/install-nexus.sh 
#

# fail on error
set -e

(
cd redux-okapi 
npm --silent install
)

(
cd stripes-core
npm --silent install
)

(
cd stripes-core/node_modules/stripes-loader
npm --silent install
npm --silent run build
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

