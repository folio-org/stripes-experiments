Begin by tidying up: remove NPM's existing ideas of where to get
Stripes modules:

	npm config delete @folio:registry
	npm config delete @folio-sample-modules:registry

Now make a first simple attempt to build and run the UI:

	npm install
	npm run start

This fails with:

	npm ERR! 404 Not found : @folio/stripes-connect

Usually, the version of stripes-connect in the @folio NPM registry
will be used, but we deconfigured that registry so we could use the
one in our git checkout instead. We need to add a symbolic link to
our local stripes-connect and build it:

	mkdir -p node_modules/@folio
	cd node_modules/@folio
	ln -s ../../../stripes-connect
	cd stripes-connect
	npm install
	cd ../../..
	
We will also to make need stripes-loader available in a similar way,
otherwise our next attempt to npm install will fail:

	cd node_modules/@folio
	ln -s ../../../../stripes-loader
	cd stripes-loader
	npm install
	cd ../../..

Now we can install stripes-core and start it:

	npm install
	npm run start

It now fails with:

	ERROR in /home/mike/git/work/stripes-loader/dist
	Module build failed: Error: Cannot find module '@folio-sample-modules/trivial/package.json'

So we wire the trival module into place:

	mkdir -p node_modules/@folio-sample-modules
	cd node_modules/@folio-sample-modules
	ln -s ../../../trivial
	// We don't need to npm build the trivial module, and the build just no-ops.
	cd ../..

And try again to run the UI server:

	npm run start

Once more this fails in exactly the same way:

	ERROR in /home/mike/git/work/stripes-loader/dist
	Module build failed: Error: Cannot find module '@folio-sample-modules/trivial/package.json'

That makes no sense, as the necessary file is present:

	ls -l node_modules/@folio-sample-modules/trivial/package.json

Perhaps the trivial module needs to be present not in stripes-core's
node_modules area, but in that of stripes-loader?

	rm -rf node_modules/@folio-sample-modules
	cd ../../stripes-loader/node_modules
	mkdir @folio-sample-modules
	cd @folio-sample-modules
	ln -s ../../../stripes-experiments/trivial
	cd ../../../stripes-experiments/stripes-core

And try again to run the UI server:

	npm run start

This time we get a different error, which I think indicates progress:

	ERROR in ../trivial/About.js
	Module parse failed: /home/mike/git/work/stripes-experiments/trivial/About.js Unexpected token (4:18)
	You may need an appropriate loader to handle this file type.

XXX Does this mean that Babel is not translating this from JS6?
