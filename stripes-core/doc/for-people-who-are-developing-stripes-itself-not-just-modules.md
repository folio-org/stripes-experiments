## For Stripes developers

If you are working not just on Stripes _modules_ but on Stripes
itself, you will want to use your own git checkouts of the various
Stripes packages (`stripes-connect`, etc.) To do this, you basically
have to trick NPM into pulling in these packages from your checkout
instead of from the package repository. You do this by subverting the
`@folio` scope as follows.

First, remove any NPM configuration you may already have telling where
to download the production versions of these packages from:

	$ npm config delete @folio:registry
	$ npm config delete @folio-sample-modules:registry

Now prepopulate the Stripes core code's node modules are with symbolic
links to the code you want to work on:

	$ mkdir -p node_modules/@folio
	$ cd node_modules/@folio
	$ ln -s ../../../stripes-connect
	$ cd stripes-connect
	$ npm install
	$ cd ../../..

We will also to make need stripes-loader available in a similar way,
otherwise our next attempt to npm install will fail:

	$ cd node_modules/@folio
	$ ln -s ../../../../stripes-loader
	$ cd stripes-loader
	$ npm install
	$ npm run build
	$ cd ../../..

Next, we wire the trival module into place: so that `stripes-loader`
(not `stripes-core`) can see it:

	$ cd ../../stripes-loader/node_modules
	$ mkdir @folio-sample-modules
	$ cd @folio-sample-modules
	$ ln -s ../../../stripes-experiments/trivial
	$ cd ../../../stripes-experiments/stripes-core

You don't need to build the modules, as they get pulled into the
Stripes UI by WebPack when it is build. So now you are ready to build
and run the service that provides the UI:

	$ npm install
	$ npm run start

This may fail with:

	ERROR in ../trivial/About.js
	Module parse failed: /home/mike/git/work/stripes-experiments/trivial/About.js Unexpected token (4:18)
	You may need an appropriate loader to handle this file type.

This is because Babel is not translating the trivial from JS6. The
rules that tell WebPack which files to transpile are found in
`webpack.config.base.js`, These rules do do say to transpile files
within the `@folio` area. Unfortunately, WebPack resolves symbolic
links before making this check, so the modules that we linked into
`@folio` are instead seen as being in their physical location, and
transpilation is skipped.

The fix is to edit `webpack.config.base.js`, commenting out the
`include:` line and uncommenting the `exclude:` line that follows it,
thus:

	//include:  [path.join(__dirname, 'src'), /@folio/, path.join(__dirname, '../dev')]
	exclude: [/node_modules/]

*WARNING: do not commit this change*. If it gets pushed into the
 master repo, it will prevent modules from the NPM registry from
 working correctly.

Once this change has been made, `npm run start` will finally work, and
you can view the running UI on `http://localhost:3000/

