#!/bin/sh

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

