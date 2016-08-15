# Stripes Experiments

## Installation
Currently, stripes-loader is loaded from github so will need to be built manually rather than via prepublish script because of this:
https://github.com/npm/npm/issues/3055

```
    cd stripes-connect
    npm install
    cd ..
    cd stripes-core
    npm install
    cd node_modules/stripes-loader
    npm install
    npm run build
    cd ../..
    ln -s ../.. node_modules/@stripes-experiments  #(see notes regarding OS'es without symlink)
    npm start
```

Note: node.js version 6.x is required for running stripes-experiments. Older node.js 
versions are likely to fail due changes in react/redux

Some node modules require an installed C++ compiler (g++)

### macos
```
$ brew install node
```

### debian
go to https://nodejs.org/en/download/current/ and download the Linux Binaries. Extract the
archive, and symlink the programs "node" and "npm" to /usr/local/bin

### MS Windows
Go to https://nodejs.org/en/, select version 6.x to for your Windows version and follow 
the instructions in the installer. (Tested for Nodejs 6.2.2, 64bit version, on Windows 7.)  

## AWS S3

To upload files to AWS S3, you need the aws(1) tool installed, and setup ~/.aws
for you. See `aws configure'

### debian
$ sudo apt-get install awscli

### macos
$ brew install awscli


## Webpack service

run a local installation (see the readme above)
```
$ ./bin/install-nexus.sh
```

start webpack service on port 3030
```
cd stripes-core && npm run start:webpack 
```

open web form to generate folio UI bundle
```
$ open http://localhost:3030
```
and fill out the forms, and press submit


## Example run with GET (browser)

```
$ node stripes-core/webpackServer.js
```

```
Example app listening on http://localhost:3030
Run shell command: env stripes_tenant="test" ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz  " ./bin/tenant-bundle.sh
Run build, may take 20-30 seconds, tenant test
UI module: ["trivial","https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz","",""]
Webpack script is done
AWS S3 URL: http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469456474/index.html
```


in your browser
```
open http://localhost:3030
```

and after 20-30 seconds you should get the result as:
```
{"status":201,"url":"http://s3.amazonaws.com/folio-ui-bundle/tenant/test-1469456474/index.html"}
```


## Example run with POST (command line)

or more Okapi style with a post request:

```
$ cat etc/post.json
{"url":["trivial", "https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz"] }
```
    
```
$ curl -v -H "X-Okapi-Tenant-Id: test2" -X POST --data-binary @./etc/post.json -H "Content-Type: application/json" 'http://localhost:3030/bundle'
HTTP/1.1 201 Created
Location: http://s3.amazonaws.com/folio-ui-bundle/tenant/test2-1469549040/index.html
```


## Testing with a shell script

testing on the command line
```
$ env tenant="test" ui_url="trivial https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz" ./bin/tenant-bundle.sh
```


## Misc

AWS S3 supports both HTTP and HTTPS. We are using HTTP URLs to enable
access to a local running okapi instance on localhost:9130

## uiDescriptor

Create a tenant "test", and assign 2 UI modules:

```
$ tenant=test module="trivial trivial-okapi" ./bin/ui-deploy.sh
```


## Note for OS without symlinks (MS Windows): 

  For installing on an OS that does not support symbolic links,
  this bash script (or equivalent) can be used instead of the line
```
    'ln -s ../.. node_modules/@stripes-experiments' 
```
  assuming that Git bash or cygwin or similar is used. 
  It should be run in the project root (stripes-experiments/)
  You would furthermore need to change a line in ./stripes-core/webpack.config.base.js,
  please follow the comments regarding include and exclude in that file. 


```
   if [ ! -e "stripes-core/node_modules/\@stripes-experiments" ]; then
     mkdir stripes-core/node_modules/\@stripes-experiments
   fi
   for d in */ ; do
     dir=$(basename "$d")
     if [ "stripes-core" != $dir ]; then
       rm -r stripes-core/node_modules/\@stripes-experiments/$d
       cp -r $d stripes-core/node_modules/\@stripes-experiments/.
     fi
   done
```

--
Index Data, Aug 2016

