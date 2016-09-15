## For Stripes developers

If you are working not just on Stripes _modules_ but on Stripes
itself, you will want to use your own git checkouts of the various
Stripes packages (stripes-connect, etc.) To do this, you basically
have to trick NPM into pulling in these package from your checkout
instead of from the package repository. You do this by subverting the
`@folio` scope as follows:

     $ cd stripes-experiments/stripes-core
     $ npm install
     $ cd node_modules
     $ rm -rf @folio
     $ ln -s ../../../stripes-experiments @folio

You will also need to build (`npm install`) the included Stripes
components and modules yourself:

     $ cd @folio/stripes-connect
     $ npm install
     $ cd ../..

Finally, you need to enable to Stripes loader, which is used by
WebPack at runtime to pull in the necessary modules:

     $ ln -s ../../../stripes-loader
     $ cd stripes-loader
     $ npm install
     $ npm run build
     $ cd ..

If you want to work on local copies of modules (trivial,
trivial-okpai, etc.), you will also need to subvert the
`@folio-sample-modules` scope and build whatever modules you want
access to:

     $ rm -rf @folio-sample-modules
     $ ln -s ../../../stripes-experiments @folio-sample-modules

You don't need to build the modules, as they get pulled into the
Stripes UI by WebPack when it is build. So now you are ready to run
the service that provides the UI:

     $ cd ..
     $ npm run start

