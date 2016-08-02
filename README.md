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

AWS S3
-------------
To upload files to AWS S3, you need the aws(1) tool installed, and setup ~/.aws
for you. See `aws configure'

# debian
$ sudo apt-get install awscli

# macos
$ brew install awscli


Webpack
----------------------------------------------------
# run a local installation (see the readme above)
$ ./bin/install-nexus.sh

# start webpack service on port 3030
cd stripes-core && npm run start:webpack 

# open web form to generate folio UI bundle
$ open http://localhost:3030
and fill out the forms, and press submit


Example run with GET (browser)
-------------------------------------------------------
npm run start:webpack

> stripes-core@0.0.1 start:webpack /home/wosch/indexdata/stripes-experiments/stripes-core
> cd ../ && node stripes-core/webpackServer.js

Example app listening on http://localhost:3030
Run shell command: env stripes_tenant="test" ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz  " ./bin/tenant-bundle.sh
Run build, may take 1-2 minutes, tenant test
UI module: ["trivial","https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz","",""]
Webpack script is done
AWS S3 URL: http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469456474/index.html


# in your browser
open http://localhost:3030

and after 20-30 seconds you should get the result as:
{"status":201,"url":"http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469456474/index.html"}


Example run with POST (command line)
-----------------------------------------------------------
or more Okapi style with a post request:

$ cat etc/post.json
{"url":["trivial", "https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz"] }
    
$curl -v -H "X-Okapi-Tenant-Id: test2" -X POST --data-binary @./etc/post.json -H "Content-Type: application/json" 'http://localhost:3030/bundle'
HTTP/1.1 201 Created
Location: http://s3.amazonaws.com/folio-ui-bundle/tenant/test2-1469549040/index.html


Testing with a shell script
-----------------------------------------------------------
# testing on the command line
$ env tenant=test ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz" ./bin/tenant-bundle.sh


Misc
------------------------------------------------------------
AWS S3 supports both HTTP and HTTPS. We are using HTTP URLs to enable
access to a local runing okapi instance on localhost:9130
