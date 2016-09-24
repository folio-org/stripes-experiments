# The Stripes Connect API

<!-- pandoc -f markdown_github-hard_line_breaks api.md > api.html -->
<!-- ../../okapi/doc/md2toc -l 2 api.md -->
* [Introduction](#introduction)
* [The Connection Manifest](#the-connection-manifest)
    * [Resource types](#resource-types)
    * [Local resources](#local-resources)
    * [REST resources](#rest-resources)
    * [Okapi resources](#okapi-resources)
        * [Example](#example)
* [Connecting the component](#connecting-the-component)
* [Appendix A: operation](#appendix-a-operation)
* [Appendix B: unresolved issues](#appendix-b-unresolved-issues)
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
addition to `'type':'rest'`:

* `url`: the base URL of the service that persists the data. (XXX Is
  this right? The code seems to use `root`.)

* `path`: the path for this resource below the specified root. The
  path consists of one or more `/`-separated components: each
  component may be a literal, or a placeholder of the form `:`_name_,
  which is replaced at run-time by the value of the named property.

* `params`: A JavaScript object containing named parameters to be
  supplied as part of the URL. These are joined with `&` and appended
  to the path with a `?`.
  The root, path and parames together make up the URL that is
  addressed to maintain the resource.

* `headers`: A JavaScript object containing HTTP headers: the keys are
  the header names and the values are their content. (XXX In the
  present code, `headers` contains a map of HTTP verbs to sets of
  headers: is that how we plan to keep this, or will it change?)

* `records`: The name of the key in the returned JSON that contains
  the records. Typically the JSON response from a web service is not
  itself an arrau of records, but an object containing metadata abaout
  the result (result-count, etc.) and a sub-array that contains the
  actual records. The `records` item specifies the name of that
  sub-array within the top-level response object.

* `pk`: The name of the key in the returned records that contains
  the primary key. (Defaults to `id` for both REST and Okapi
  resources.)

* `clientGeneratePk`: a boolean indicating whether the client must
  generate a "suffiently unique" private key for newly created
  records, or must accept one that is supplied by the service in
  response to a create request. Defaults to `true`.

In addition to these principal pieces of configuration, which apply to
all operations on the resource, these values can be overridden for
specific HTTP operations: the entries `GET`, `POST`, `PUT`, `DELETE`
and `PATCH`, if supplied, are objects containing configuration (using
the same keys as described above) that apply only when the specified
operation is used.

### Okapi resources

Okapi resources are REST resources, but with defaults set to make
connecting to Okapi convenient:

* `url`: defaults to a globally configured address pointing to an
  Okapi instance.

* `headers`: are set appropriately for each HTTP operation to send the
  tenant-ID, specify that the POSTed or PUT body is JSON and expect
  JSON in response.

#### Example

This manifest (from the Okapi Console component that displays the
health of running modules) defines two Okapi resources, `health` and
`modules`, providing paths for both of them that are interpreted
relative to the default root. In the modules response, the primary key
is the default, `id`; but in the health response, it is `srvcId`, and
the manifest must specify this.

        static manifest = {
          'health': {
            type: 'okapi',
            pk:   'srvcId',
            path: '_/discovery/health'
          },
          'modules': {
            type: 'okapi',
            path: '_/proxy/modules'
          }
        };


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


## Appendix A: operation

XXX tidy up

The operation of this is also important to document---there are two props
passed to the wrapped component:

* `data`: contains either data associated with a resource or null if
  the data is pending and not currently fetched
* `mutator`: has properties named after each resource with methods
  for a selection of HTTP verbs that may optionally take an id to
  append to the contents of "path" which may wind up with duplication
  if you, for example, run mutators.someResource.DELETE(124) on
  /patrons/124 rather than just DELETE().



## Appendix B: unresolved issues

XXX tidy up

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