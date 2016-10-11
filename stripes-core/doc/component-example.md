# A component example: the **PatronEdit** component

<!-- ../../../okapi/doc/md2toc -l 2 component-example.md -->
* [Introduction](#introduction)
* [Source code](#source-code)
* [Explanation](#explanation)
    * [Imports (lines 1-4)](#imports-lines-1-4)
    * [Definition of class **PatronEdit** (lines 7-41)](#definition-of-class-patronedit-lines-7-41)
    * [The data manifest (lines 10-14)](#the-data-manifest-lines-10-14)
    * [Making the router available (lines 16-18)](#making-the-router-available-lines-16-18)
    * [Handler functions (lines 22-29)](#handler-functions-lines-22-29)
        * [`updatePatron()` (lines 22-25)](#updatepatron-lines-22-25)
        * [`cancel()` (lines 27-29)](#cancel-lines-27-29)
    * [Rendering the edit form (lines 31-41)](#rendering-the-edit-form-lines-31-41)
    * [Connecting the component (line 44)](#connecting-the-component-line-44)
* [Summary](#summary)

## Introduction

The **PatronEdit** component is defined in the source file
[`patrons/PatronEdit.js`](../../patrons/PatronEdit.js).
As is conventional, the filename is that same as that of the component.

The **PatronEdit** source code is quite short (44 lines including
blanks and comments). This is achieved by including the **PatronForm**
component from its own 400-line file, which is also used by
**PatronAdd**. Despite its length, **PatronForm** is very simple:
essentially all it does is create an HTML form wired into Redux's
form-handling machinery. Crucially, it is not a
[connected component](../../stripes-connect/api.md#introduction),
so it uses no Stripes machinery: it is pure React.

**PatronEdit** itself _is_ a connected component, as serves as a
simple example for how to create such components. This document will
walk through the source code and explain each section.


## Source code

This is the code as of git commit
[f00edbd46df003bd27b7da2989a42079bad5e2f3](https://github.com/folio-org/stripes-experiments/blob/f00edbd46df003bd27b7da2989a42079bad5e2f3/patrons/PatronEdit.js).

```
     1	import React, { Component, PropTypes } from 'react';
     2	import { connect } from 'stripes-connect';
     3	import PatronForm from './PatronForm';
     4	import { actionTypes } from './PatronForm';
     5	
     6	// One of multiple stripes-connected components in the patrons module
     7	class PatronEdit extends Component {
     8	
     9	  // The manifest is provided in components by the module developer and consumed by 'stripes connect'
    10	  static manifest = { 'patrons': { type: 'okapi',
    11	                                   pk: '_id',  // The primary key of records from this end-point
    12	                                               //  (when it's not the default, "id")
    13	                                   path: 'apis/patrons/:patronid' // request parameter, provided by router
    14	                                 }};
    15	
    16	  static contextTypes = {
    17	    router: PropTypes.object.isRequired
    18	  };
    19	
    20	  // Invokes the mutator provided by stripes connect to perform a PUT
    21	  // Uses router object to navigate back to list
    22	  updatePatron(data) {
    23	    this.props.mutator['patrons'].PUT(data);
    24	    this.context.router.push('/patrons/list');
    25	  }
    26	
    27	  cancel(data) {
    28	    this.context.router.push('/patrons/list');
    29	  }
    30	
    31	  render() { 
    32	      const { data: { patrons }, params: { patronid } } = this.props;
    33	
    34	      let patron = patrons.find((patron) =>  { return patron._id === patronid });
    35	
    36	      return <PatronForm onSubmit={this.updatePatron.bind(this)} 
    37	        cancelForm={this.cancel.bind(this)}
    38	        action={actionTypes['update']}
    39	        initialValues={patron} />
    40	  }
    41	}
    42	
    43	// This function call might be implicit in a future version (invoked by the framework)
    44	export default connect(PatronEdit, 'patrons');
```

## Explanation

Stripes components are written in
[ES6](https://github.com/lukehoban/es6features),
also known as ECMAScript 6 or (confusingly) ECMAScript 2015. This is a
modern dialect of JavaScript that includes numerous new and important
features, including classes, `let` and `const`, promises and modules.

Because most Web browsers do not yet support ES6, it must be
[transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler)
into old-style JavaScript. This is done by Babel when the Stripes
application is built using NPM. (Babel is also responsible for pulling
in the correct set of modules that are required by the particular
Stripes application.)

The source-code below therefore includes some idioms that will not be
familiar to all JavaScript programmers.

### Imports (lines 1-4)

ES6 `import` syntax is used to pull in objects from four other
modules. The first two are inherent to writing Stripes components; the
second two are relatesd to the use of the **PatronForm** component to
render the elements of the HTML form.

First we import three things from from React:
* The `React` object itelf, which is needed by
  [JSX](https://jsx.github.io/),
  the syntax that allows us to embed HTML/XML directly into JavaScript.
* The `Component` class, so that we can extend
  it when we define our own component).
* The `PropTypes` object, which we will later use to make the router
  available.

Next, we import the `connect` method from Stripes Connect. We will use
this at the very end of the file. to turn our React component into a
Stripes component by connecting it to Okapi.

We bring in the **PatronForm** component, along with the `actionTypes`
object which we will later use to specify that this component is
updating and existing patron rather than creating a new one.

### Definition of class **PatronEdit** (lines 7-41)

A Stripes component is a special kind of React component. We create it
by first creating a React component -- i.e. a class that extends
React's `Component` class -- and then upgrading it to a Stripes
component by calling `connect()` at the end.

### The data manifest (lines 10-14)

The data manifest describes the data resources that the component
wants to use, and how they are connected to Okapi services (if they
are -- some data may be purely on the client side.) Data manifests are
described in detail in [The Stripes Connect API
documentation](../../stripes-connect/api.md)

In this case, only a single resource is needed: `patrons`. This is
connected to Okapi; the primary key of the records is `_id` (rather
then the default `id`); and a record whose ID is _patronid_ can be
found at the path `apis/patrons/`_patronid_, relative to the base URL
of the Okapi service.

> **ISSUE.** Why is the primary key different from the default? The
> patrons API of the Circulation module should use `id` unless there
> is a compelling reason not to.

### Making the router available (lines 16-18)

XXX

### Handler functions (lines 22-29)

XXX overview

#### `updatePatron()` (lines 22-25)

XXX

#### `cancel()` (lines 27-29)

XXX

### Rendering the edit form (lines 31-41)

XXX

### Connecting the component (line 44)

XXX

## Summary

XXX

