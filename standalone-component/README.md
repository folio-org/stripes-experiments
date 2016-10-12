This is some minimal scaffolding you can use to run a single component with _stripes-connect_. You'll need to run `npm install` to fetch its dependencies.

To load a development server at `http://localhost:3000` and display a particular component, run:

    npm start -- ../path/to/SomeComponent.js

You can change the value of `OKAPI_URL` in `webpack.config.js` if the default value `http://localhost:9130` is not appropriate to your purposes.

Some caveats:

  * The `index.html` and settings here make Bootstrap CSS and resources available. You will need to make some modifications to support other toolkits.
  * The _redux-form_ reducer is part of the scaffolding and if your component expects a different version you'll need to install the appropriate NPM here as well.
  * Be sure webpack.config.js transpiles your component -- While we expect to switch to Webpack 2 once available to leverage its better support of ES6 module loading, in the interim we need to transpile such modules via the Babel loader. To do this, Webpack needs to know which files to transpile. If you are symlinking to a local checkout of stripes connect and your module is outside of `node_modules` this will work without modification, as links are resolved before paths are matched and the current configuration is set to transpile everything excluding paths matching `node_modules`. There is a commented-out `include:` line in the Babel loader configuration in `webpack.config.js` that you can add to in order that your components will be transpiled if you are using `stripes-connect` from NPM or otherwise cannot exclude all of `node_modules` from transpilation.
  * If your chosen component is outside of this directory you may see some errors about the sourcemap. Try commenting-out `devtool: 'inline-source-map',` from `webpack.config.js` or symlinking your component into this tree.
