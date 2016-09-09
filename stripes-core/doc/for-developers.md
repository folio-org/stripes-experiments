## For Stripes developers

If you are working not just on Stripes _modules_ but on Stripes
itself, you will want to use your own git checkouts of the various
Stripes packages (stripes-connect, etc.) and modules (mod-circulation,
etc.) To do this, you basically have to trick NPM into pulling in
these package from your checkout instead of from the package
repository. You do this by subverting the `@folio` and
`@folio-sample-modules` scopes as follows:

     $ npm install
     $ cd node_modules
     $ rm -rf @folio @folio-sample-modules
     $ ln -s ../../../stripes-experiments @folio
     $ ln -s ../../../stripes-experiments @folio-sample-modules
     $ ln -s ../../stripes-loader

You will also need to build (`npm install`) the included Stripes
components and modules yourself; and in the special case of
`stripes-loader` (which is a WebPack plugin) also `npm run build`
