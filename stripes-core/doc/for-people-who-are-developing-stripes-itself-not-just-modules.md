## For Stripes developers

If you are working not just on Stripes _modules_ but on Stripes
itself, you will want to use your own git checkouts of the various
Stripes packages (stripes-connect, etc.) To do this, you basically
have to trick NPM into pulling in these package from your checkout
instead of from the package repository. You do this by subverting the
`@folio` scope as follows:

     $ npm install
     $ cd node_modules
     $ rm -rf @folio
     $ ln -s ../../../stripes-experiments @folio

If you want to work on local copies of modules (mod-circulation,
etc.), you will need to do something similar in `node_modules`:

     $ rm -rf @folio-sample-modules
     $ ln -s ../../../stripes-experiments @folio-sample-modules

You will also need to build (`npm install`) the included Stripes
components and modules yourself.

Finally, 

     $ ln -s ../../../stripes-loader

And in `stripes-loader` run both `npm install` and `npm run build`.
