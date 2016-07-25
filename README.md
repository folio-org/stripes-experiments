Currently, stripes-loader is loaded from github so will need to be built manually rather than via prepublish script because of this:
https://github.com/npm/npm/issues/3055

    cd redux-okapi
    npm install
    cd ..
    cd stripes-core
    npm install
    cd node_modules/stripes-loader
    npm install
    npm run build
    cd ../..
    ln -s ../.. node_modules/@stripes-experiments
    npm start

Note: node.js version 6.x is required for running stripes-experiments. Older node.js 
versions are likely to fail due changes in react/redux

Some node modules require an installed C++ compiler (g++)

# macos
$ brew install node

# debian
go to https://nodejs.org/en/download/current/ and download the Linux Binaries. Extract the
archive, and symlink the programs "node" and "npm" to /usr/local/bin

Webpack
----------------------------------------------------
# run a local installation (see the readme above)
$ ./bin/install-nexus.sh

# start webpack service on port 3030
cd stripes-core && npm run start:webpack 

# open web form to generate folio UI bundle
$ open http://localhost:3030
and fill out the forms, and press submit


# testing on the command line
$ env tenant=test ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz" ./bin/tenant-bundle.sh

AWS S3
-------------
To upload files to AWS S3, you need the aws(1) tool installed, and setup ~/.aws
for you. See `aws configure'

# debian
$ sudo apt-get install awscli

# macos
$ brew install awscli

Example run
-------------------------------------------------------
npm run start:webpack

> stripes-core@0.0.1 start:webpack /home/wosch/indexdata/stripes-experiments/stripes-core
> cd ../ && node stripes-core/webpackServer.js

Example app listening on http://localhost:3030
Run shell command: env stripes_tenant="test" ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz  " ./bin/tenant-bundle.sh
Run build, may take 1-2 minutes, tenant test
UI module: ["trivial","https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz","",""]
Webpack script is done
AWS S3 URL: http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469452979/index.html


# in your browser
http://localhost:3030
{"status":200,"url":"http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469452979/index.html"}
