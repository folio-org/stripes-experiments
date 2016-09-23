# The Stripes Connect API

<!-- pandoc -f markdown_github-hard_line_breaks api.md > api.html -->
<!-- ../../okapi/doc/md2toc -l 2 api.md -->
* [Introduction](#introduction)
* [The Connection Manifest](#the-connection-manifest)
    * [Resource types](#resource-types)
    * [Local resources](#local-resources)
    * [REST resources](#rest-resources)
* [Connecting the component](#connecting-the-component)
* [Appendix: unresolved issues](#appendix-unresolved-issues)
    * [How to not fetch](#how-to-not-fetch)
    * [One vs. Many](#one-vs-many)
    * [Metadata](#metadata)
    * [Errors](#errors)
    * [Count](#count)


## Introduction

Stripes Connect is one of the most important part of the Stripes
toolkit for building FOLIO UIs. It provides the connection between the
UI and the underlying services -- most usually, Okapi (the FOLIO
middleware), though other RESTful web services are also suported.

A Stripes UI is composed of
[React](https://facebook.github.io/react/)
components. (You will need to learn at least the basics of React in
order to use Stripes.) Any component may use the services of Stripes
Connect to automate communication with back-end services. Such a
component is known as a "connected component".

In order to take advantage of Stripes Connect, a component must do two
things: declare a _manifest_, which describes what data elements it
wants to manage and how to link them to services; and call the
`connect()` method on itself.


## The Connection Manifest

The manifest is provided as a static member of the component class. It
is JavaScript object in which the keys are the names of resources to
be managed, and the corresponding values are objects specifying how to
deal with them:

        static manifest = {
          'name': { /* ... */ },
          'address': { /* ... */ },
          'jobTitle': { /* ... */ }
        };

### Resource types

Each resource has several keys. The most important of these is `type`,
which determines how the associated data is treated. Currently, three
types are supported:

* `local`: a local resource (client-side only), which is not persisted
  by means of a service.
* `okapi`: a resource that is persisted by means of a FOLIO service
  mediated by Okapi.
* `rest`: a resource persisted by some RESTful service other than
  Okapi.

(In fact, the `okapi` type is merely a special case of `rest`, in
which defaults are provided to tailor the RESTful dialgoues in
accordance with Okapi's conventions.)

### Local resources

A local resource needs no configuration items -- not even an explicit
`type`, since the default type is `local`. So its configuration can
simply be specified as an empty object:

        static manifest = {
          'someLocalResource': {}
        }

### REST resources

REST resources are configured by the following additional keys in
addition to '`type`:`rest`':

XXX tidy this up

* `url` -- the base URL of the service that persists the data. (XXX is this right? The code seems to use `root`.)
* `path` -- the path for this resource below the specified root
* `params` -- JS object for parameters to serialise and append with ?
* `headers` -- JS object with header values
* `records` -- key in the returned JSON that contains records
* `pk` -- key in the returned JSON (or individual record) that contains
  the primary key (defaults to id for both restResource and
  okapiResource)
* `clientGeneratePk` -- a boolean indicating if the client can generate
  a private key or must accept one
* `GET`/`POST`/`PUT`/`DELETE`/`PATCH` -- values for some or all of the
  above (at minimum, `url`/`path`/`params` but maybe just everything?)
  that take precendence when operating with a particular HTTP verb.

The operation of this is also important to document---there are two props
passed to the wrapped component:

* `data` -- contains either data associated with a resource or null if
  the data is pending and not currently fetched
* `mutator` -- 	      has properties named after each resource with methods
  for a selection of HTTP verbs that may optionally take an id to
  append to the contents of "path" which may wind up with duplication
  if you, for example, run mutators.someResource.DELETE(124) on
  /patrons/124 rather than just DELETE().

### Okapi resources

XXX todo type='okapi' sets some defaults for many of them.


## Connecting the component

React components are classes that extend `React.Component`.  Instead
of using a React-component class directly -- most often by exporting
it -- use the result of passing it to the `connect()` method of
Stripes Connect.

For example, rather than

        export class Widget extends React.Component {
          // ...
        }

or

        class Widget extends React.Component {
          // ...
        }
        export Widget;

use

        import { connect } from 'stripes-connect';
        class Widget extends React.Component {
          // ...
        }
        export connect(Widget, 'stripes-module-name');

(At present, it is necessary to pass as a second argument the name of
the Stripes module that contains the connect component. We hope the
remove this requirement in future.)


## Appendix: unresolved issues

(This section is only for developers working on Stripes itself. Those
workingv on _using_ Stripes to build a UI can ignore it.)

### How to not fetch

Sometimes we only want a mutator, maybe we're making the
add form. One suggestion is that we not have any path at all at the top
level in this case, only POST.path to indicate the desired subset of
functionality. I like the minimalism of that but feel it might be a bit
opaque. Perhaps a
boolean of mutatorOnly or noFetch is more explicit?

### One vs. Many

Right now there is no clear standard as to what data is
returned by things, I think? eg. a single record by id gives you a single
record; a query that matches a single record gives you an array with one
element. Or does it always? I don't know if we can say that reliably as
isn't it up to the remote API?

### Metadata

We use this "redux-crud" library to, among other things, generate
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

### Errors

Right now we have no real error handling, do we? Maybe we can have
props.data.someResource.error be a special key with an object describing the
error? Or... something? We need to surface the HTTP error somewhere anyhow.

### Count

Can we get a count of holds on an item? How does that API work and
does our above system mesh with it well enough to provide a pleasant
developer experience