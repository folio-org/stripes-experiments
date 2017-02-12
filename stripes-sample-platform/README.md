This is an example of a Stripes "platform". It consists simply of an NPM [`package.json`](https://docs.npmjs.com/files/package.json) that specifies the version of `@folio/stripes-core` and of any Stripes modules you wish to make available to generate client bundles. 

We strongly recommend using [yarn](https://yarnpkg.com/) rather than NPM to install. Once you have it, that's as simple as running `yarn install` from this directory.

Aside from dependencies, this `package.json` also provides some scripts to run `stripes` from `stripes-core`. This CLI tool has two main commands: `stripes dev <someconfig>` to run a dev server with a given config and `stripes build <someconfig>` to build a bundle with it. This example maps `yarn start` to `stripes dev stripes.config.js` and `yarn run build` to `stripes build stripes.config.js`. It also provides an alias `yarn run stripes` so you can pass arbitrary commands or see the help output.

Module developers and those wanting to use local checkout of core Stripes components can use the convenient [`yarn link`](https://yarnpkg.com/docs/cli/link/) command to set their platform to use the local copy. Simply run `yarn link` in your `somemodule` directory and then run `yarn link somemodule` in the platform's directory and repeat for each local dependency you wish to create symlinks for.
