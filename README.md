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

# macos
$ brew install node

Webpack
----------------------------------------------------
# run a local installation (see the readme above)
$ ./bin/install-nexus.sh

# start webpack service on port 3030
$ node ./stripes-core/webpackServer.js 

# open web form to generate folio UI bundle
$ open ./stripes-core/webpack.html 

# testing on the command line
$ env tenant=wolfram ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz" ./bin/tenant-bundle.sh

AWS S3
-------------
To upload files to AWS S3, you need the aws(1) tool installed, and setup ~/.aws
for you. See `aws configure'

# debian
$ sudo apt-get install awscli
# macos
$ brew install awscli


