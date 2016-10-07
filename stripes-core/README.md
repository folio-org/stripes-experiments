# Stripes Core

This is a single-page web application that provides a platform for React components from configured modules according to their "type". (At the moment, the only "type" is "fullpage" and from metadata we glean which routes to display which components on and which of those need menu entries). 


## Documentation roadmap

* Quick start guide: read on below
* [Overview of the Stripes architecture](doc/overview.md)
* [Running Stripes from git checkouts](doc/for-people-who-are-developing-stripes-itself-not-just-modules.md)
* [Testing the Okapi Console and circulation module](../okapi-console/testing-the-circulation-module.md)
* [The stripes-connect API](./stripes-connect/api.md)
* [A component hiearchy example: the "Patrons" module](doc/component-hierarchy.md)


## Quick start

To run Stripes, you'll need to have [NodeJS](https://nodejs.org/) 6.x installed.

### Very quick

```
npm config set @folio:registry https://repository.folio.org/repository/npm-folio/
npm install
npm config set @folio-sample-modules:registry https://repository.folio.org/repository/npm-folio/
npm install @folio-sample-modules/trivial
```

### Some details
 
Add the Folio NPM registry to your local NPM configuration:

`npm config set @folio:registry https://repository.folio.org/repository/npm-folio/`

Retrieve the necessary dependencies:

`npm install`

At this point you have what you need to run the system. Edit `webpack.config.cli.js` to indicate which modules you want to include and the URL to the back end. Run `npm start` to bring up a development server at http://localhost:3000/ or `npm run build` to output a set of files which can then be deployed to a web server.

### Demos

We have some sample modules to play with in the `@npm-sample-modules` scope on our registry. Run this to let it know where to look:

`npm config set @folio-sample-modules:registry https://repository.folio.org/repository/npm-folio/`

#### trivial

The default configuration references a module, "trivial", which demonstrates a simple use of "stripes-connect". You can install it via npm:

`npm install @folio-sample-modules/trivial`

#### trivial-okapi

Another demo, "trivial-okapi", shows the most basic communication with the [Okapi](https://github.com/folio-org/okapi) API gateway and will require a connection to it in order to run. It lists tenants and allows their deletion. This simple exercise only relies on Okapi rather than a collection of services so it's relatively easy to set up locally without needing Docker.

After following build instructions in the [Okapi repository](https://github.com/folio-org/okapi) to get the service running, you can install the demo as below and activate it by editing `webpack.config.cli.js` before starting the dev server or building a bundle.

`npm install @folio-sample-modules/trivial-okapi`

