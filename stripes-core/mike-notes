Simple approach:

	npm install
	npm run start

Fails with:

	ERROR in ./~/@folio/stripes-loader/dist!
	Module build failed: Error: Cannot find module '@folio-sample-modules/trivial/package.json'

Evidently some form of stripes-loader is being found -- presumably
from the @folio space. So the first thing to learn is that we're using
the wrong @stripes-loader. Replace it with the git checkout and build
it. (This assumes that stripes-loader is checked out alongside
stripes-experiments.)

	cd node_modules/@folio
	rm -rf stripes-loader
	ln -s ../../../../stripes-loader
	cd stripes-loader
	npm install
	cd ..

While we're there, we may as well also fix it to use the most recenty stripes-connect:

	rm -rf stripes-connect
	ln -s ../../../stripes-connect
	cd stripes-connect
	npm install
	cd ../../..

Now we can try again to run the UI server:

	npm run start

Once more this fails with:

	ERROR in /home/mike/git/work/stripes-loader/dist
	Module build failed: Error: Cannot find module '@folio-sample-modules/trivial/package.json'

But at least now it's the right version of stripes-loader that is failing.
XXX Should it concern us that "stripes-loader/dist" is now reported without an exclamation mark?

So we wire the trival module into place:

	cd node_modules
	mkdir @folio-sample-modules
	cd @folio-sample-modules
	ln -s ../../../trivial
	XXX Do we need to npm build the trivial module? Apparently not: npm build in trivial seems to no-op.
	cd ../..

And try again to run the UI server:

	npm run start

Once more this fails in exactly the same way:

	ERROR in /home/mike/git/work/stripes-loader/dist
	Module build failed: Error: Cannot find module '@folio-sample-modules/trivial/package.json'

That makes no sense, as the necessary file is present:

	cd node_modules
	ls -l @folio-sample-modules/trivial/package.json
	cd ..

Perhaps the trivial module needs to be present not in stripes-core's
node_modules area, but in that of stripes-loader?

	rm -rf node_modules/@folio-sample-modules
	cd ../../stripes-loader/node_modules
	mkdir @folio-sample-modulesg
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
