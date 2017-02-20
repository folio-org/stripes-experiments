# Standalone Stripes components

This is some minimal scaffolding you can use to run a single component with _stripes-connect_. You'll need to run `npm install` to fetch its dependencies.

To load a development server at `http://localhost:3000` and display a particular component, run:

    npm start -- ../path/to/SomeComponent.js

For example

    npm start -- ../okapi-console/tenants/TenantList.js

You can change the value of `OKAPI_URL` in `webpack.config.js` if the default value `http://localhost:9130` is not appropriate to your purposes.

Some caveats:

  * The `index.html` and settings here make Bootstrap CSS and resources available. You will need to make some modifications to support other toolkits.
  * The _redux-form_ reducer is part of the scaffolding and if your component expects a different version you'll need to install the appropriate NPM here as well.
  * Be sure webpack.config.js transpiles your component -- While we expect to switch to Webpack 2 once available to leverage its better support of ES6 module loading, in the interim we need to transpile such modules via the Babel loader. To do this, Webpack needs to know which files to transpile. If you are symlinking to a local checkout of stripes connect and your module is outside of `node_modules` this will work without modification, as links are resolved before paths are matched and the current configuration is set to transpile everything excluding paths matching `node_modules`. There is a commented-out `include:` line in the Babel loader configuration in `webpack.config.js` that you can add to in order that your components will be transpiled if you are using `stripes-connect` from NPM or otherwise cannot exclude all of `node_modules` from transpilation.
  * If your chosen component is outside of this directory you may see some errors about the sourcemap. Try commenting-out `devtool: 'inline-source-map',` from `webpack.config.js` or symlinking your component into this tree.

# Jason's notes for STRIPES-22

## Introduction

A while back, we intended to write a proper API document for using Stripes components in a standalone way, outside of stripes-core. But now that we have the much easier [platform-based workflow](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md) there is less need to do this. Below are the raw notes that Jason wrote, intending them to be the basis for an API document. They may now be out of date, so _caveat emptor_.

## Raw notes

Mike has volunteered to document the Stripes Connect REST Resource Manifest
API and I'm chiming in with my sense of what we were converging on as a
starting point for him. When you're back Niels, please correct us as you're
the one that has implemented many of these changes already and probably
author of the most code consuming it.

A Manifest for Resource where type='rest' has the following other keys in
addition to 'type', type='okapi' sets some defaults for many of them. The
manifest itself is a static property of a React Component to be wrapped by
connect(component, modulename). But we probably should consider not adding
it within the class as a static property and instead just defining
> ClassName.manifest = { stuff }
after the class definition as then we don't
need to support as drafty a standard of Javascript (See STRIPES-5 for details)

* url - base url of the site
* path - path for this resource
* params - JS object for parameters to serialise and append with ?
* headers - JS object with header values
* records - key in the returned JSON that contains records
* pk - key in the returned JSON (or individual record) that contains the
primary key (defaults to id for both restResource and okapiResource)
* clientGeneratePk - a boolean indicating if the client can generate a private
key or must accept one
* GET/POST/PUT/DELETE/PATCH - values for some or all of the above (at minimum,
url/path/params but maybe just everything?) that take precendence when
operating with a particular HTTP verb.

The operation of this is also important to document---there are two props
passed to the wrapped component:

* data - contains either data associated with a resource or null if the data
is pending and not currently fetched
* mutator - has properties named after each resource with methods for a
selection of HTTP verbs that may optionally take an id to append to the
contents of "path" which may wind up with duplication if you, for example,
run mutators.someResource.DELETE(124) on /patrons/124 rather than just
DELETE().

### Unresolved Issues

How to not fetch - sometimes we only want a mutator, maybe we're making the
add form. One suggestion is that we not have any path at all at the top
level in this case, only POST.path to indicate the desired subset of
functionality. I like the minimalism of that but feel it might be a bit
opaque. Perhaps a
boolean of mutatorOnly or noFetch is more explicit?

One VS. many - right now there is no clear standard as to what data is
returned by things, I think? eg. a single record by id gives you a single
record; a query that matches a single record gives you an array with one
element. Or does it always? I don't know if we can say that reliably as
isn't it up to the remote API?

Metadata - we use this "redux-crud" library to, among other things, generate
actions. It causes a number of compromises such as our needing to clear out
the redux state at times because it is designed for a slightly different
universe where there is more data re-use. As part of that, it prefers to
treat the responses as lists of records it can merge into its local store
which makes having a top level of metadata with an array property "patrons"
or similar a bit incompatible. We currently pass it a key from the manifest
if it needs to dig deeper to find the records. But that means we just
discard the top level metadata. It may soon come time to reimplement
redux-crud ourselves and take full control of how data is being shuffled
around. Among other things, it would give the option to let our API be more
true to intent and transparently expose the data returned by the REST request.

Errors - right now we have no real error handling, do we? Maybe we can have
props.data.someResource.error be a special key with an object describing the
error? Or... something? We need to surface the HTTP error somewhere anyhow.

Count - can we get a count of holds on an item? How does that API work and
does our above system mesh with it well enough to provide a pleasant
developer experience

