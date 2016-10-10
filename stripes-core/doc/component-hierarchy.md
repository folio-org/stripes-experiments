# A component hiearchy example: the `patrons` module

## Introduction

Building a Stripes application consists of plugging Stripes modules
together. Creating modules is the core development activity in
Stripes: most UI developers will spend most of their time putting
together modules that provide an interface to some functionality
provided on the server-side.

Stripes modules are composed of components. Stripes components are
[React](https://facebook.github.io/react/) components, wrapped in some
additional functionality. Most importantly, a _connected component_ is
one that uses the services of the stripes-connect library to connect
it to data -- most usually, data maintained via an Okapi-mediated
FOLIO module, but potentially also other RESTful web-services or even
purely local (non-persistent) data.

This document illustrates how components can work together as a
module: in particular, it discusses how the components of a
hypothetical `patrons` fullpage module that support search and display
of patron records and associated data such as holds and loans.

Module names are written in all lower-case, with words separated by
hyphens and set in code font `like-this`. Component names are written
in CamelCase and set in bold, **LikeThis**.

<!-- ../../../okapi/doc/md2toc -l 2 component-hierarchy.md -->
* [Introduction](#introduction)
* [The module](#the-module)
    * [Metadata describing the module](#metadata-describing-the-module)
    * [State within the module](#state-within-the-module)
* [Components](#components)
    * [Patrons](#patrons)
    * [PatronRouter](#patronrouter)
    * [TopBar](#topbar)
    * [SearchBox](#searchbox)
        * [SearchSettings](#searchsettings)
    * [Display](#display)
        * [Holds](#holds)
            * [HoldBrief](#holdbrief)
                * [ItemBrief](#itembrief)
        * [Loans](#loans)
            * [LoanBrief](#loanbrief)
        * [Blocks](#blocks)
    * [SearchResults](#searchresults)
        * [SearchResult](#searchresult)
* [Appendix: issues to be discussed](#appendix-issues-to-be-discussed)




## The module


### Metadata describing the module

Each Stripes module is described by metadata -- some of it affecting
how it functions, some merely descriptive. For a `patrons` module, the
metadata might look like this:

```
{
  'name': 'Patrons',      // Human-readable caption used for menus, etc.
  'type': 'fullpage',     // As opposed to "menubar", “popup”, etc.
  'route': '/patrons',    // The module runs when a URL ending with this path is used
  'component': 'Patrons'  // Name of the top-level component loaded for the specified route
}
```

The metadata of the various modules making up a Stripes application is
aggregated by stripes-loader. (Code-loading is handled asynchronously
so that a module's code is sent to the browser sent when visiting a
route that uses it.)


### State within the module

Each stripes module maintains all of its state in a single pool. (See
[**How state is stored**](../../stripes-connect/api.md#how-state-is-stored)
for details).
Each piece of state has a name, and may be accessed by multiple
components. Often, only one component will be responsible for making
changes to a given piece of state, while other only inspect it. In
this case, we might say that the first component "owns" that piece of
state. In the descriptions that follow, we will note which pieces of
state the components of a `patrons` module might access, and the mode of access
(**C** = create,
**R** = read,
**U** = update,
**D** = delete).

State may be persisted to a RESTful service (most often, Okapi, the
FOLIO API gateway) or it may be held locally, within the browser
session. Below, we will refer to the former as Okapi data and the
latter as local state.


## Components

All the components described here are "local", i.e.. part of this
module. It may also be possible to use components from other modules
-- most importantly, from utlity modules that act as a library of
re-usable components. The mechanisms for doing this have yet to be
specified.

Since components like ItemBrief (see [below](#itembrief)) are short
and straightforward, it may be cleaner to design such display
components repeatedly in the context of different modules, so as best
to fit them to the part of the UI where they are used; or it may prove
better to have a component library provide a one-size-fits all
brief-display component than can be parameterised or subclassed to
display items, patrons, or other kinds of data, and then reused in
disparate modules. Something like an autocompleting search-box will
likely use something from the component library, or even from a
standalone `stripes-searchbox` module repo.

Note that in the structural overview of the `patrons` module that
follows, Overdues and Fines are omitted, as they are implemented in
essentially the same way as Holds and Loans.

We now consider the individual components in turn, starting with
high-level components and working down.


### Patrons

As specified in the module metadata (see above), this is the module's
root component, used when the the URL's path begins with the
`/patrons` route. Its sole purpose is to display the top bar and
delegate the main area underneath of the patron router.

* Okapi data: none
* Local state: none
* Child components: **TopBar**, **PatronRouter**

### PatronRouter

A react-router component (somehow, syntax TBD but I'm 85% sure we can
nest these) that manages the routing for URL fragments *underneath*
`/patrons`. The module authors can have some flexibility in how they
build this and in a simple module perhaps there are no additional
routes, a mediumly complex module might just use the simple JSX
syntax, and a more complex one might organise their code however is
convenient to the team maintaining it including additional code
splitting/async loading.

Here are the routes the patron router will export, and the components
they map to:

* `:id` -- Display the record whose ID is provided (can we make it
  distinguish ':id' from 'add' and 'edit'?)
* `add` -- Add a new record.
* `edit/:id` -- Edit the record whose ID is provided.
* `search/:query` -- Run the specified query. Additional relevant
  parameters, such as start-record and the number of records to
  display, would be in the URL’s query parameters or fragment --
  details to be resolved.

Questions:

* How do you nest routes/routers? The React Router v4.x API seems to provide solutions to this.
* How does that work for route parameters? (the parts of the URL after
  the ‘?’) For example, `/patrons/search/john+doe/45` is a search
  for John Doe, displaying the 45th hit in the right pane; but
  `/patrons/search/john+doe/45?sort=name` is a sorted search,
  displaying the 45th hit in the sorted list. But the **sort=name**
  applies to the **john+doe**, not the **45**. This feels awkward. It
  gets even more complex: Inside the **PatronDetail** component we might
  have a link to add a block. A relative link to **addBlock** would
  work differently depending on the structure of the URL. There is
  much to discuss here.
* How do components grab a reference to the correct router to redirect eg. after edit?

### TopBar

A bar that goes over the top of the content area for the whole `patron`
  module, linking to various functionality and containing a search box
  to find particular patrons. Since this is a sibling of
  **PatronRouter**, it is rendered along with whichever of its
  subcomponents is selected by that router.

* Okapi data: none
* Local state: none
* Child components: **SearchBox**, perhaps also some Links or whatever
  the component library gives us that we'd use to link within the
  module

### SearchBox

The search box on the **TopBar**, it has a gear beside that drops out
a **SearchSettings** panel. Submitting the form redirects to a route
that includes `search/:query`.

* Okapi data: search completions past three characters
* Local state: search settings (per-page, sort order, etc) (R =
  read-only), recent searches (prioritised in the completions)
* Child components: **SearchSettings**

#### SearchSettings

Settings for patron search, might also include which fields for the
search

* Okapi data: none
* Local state: search settings (per-page, sort order, etc) (CRUD)
* Child components: various controls

### Display

This displays a patron's profile

* Okapi data: detailed patron record for **:id** (R) that patron, their associated item records
* Local state: none
* Child components: **Holds**, **Loans**, **Blocks**

#### Holds

Part of the patron display and styled to fit therein, this component
contains a list of the items that the patron has on hold along with a
control to add new holds.

* Okapi data: Holds for this patron (CRD), associated Items (R)
* Local state: perhaps pagination? do people have that many holds? we
  can probably pull the whole list but use a control to display a
  subset with a scrollbar or something 
* Child components: **HoldBrief**

Questions:

* We'll need the title from the Item record but do we need anything
  from the Holdings here eg. maybe the barcode number of the specific
  instance?

##### HoldBrief

Used to render a hold passed in through props, passed a reference to
the mutator too so it can have a button to delete them.

* Okapi data: none
* Local state: none
* Child components: **ItemBrief**

###### ItemBrief

Renders item title for use in **HoldBrief** and also **LoanBrief**
(see below); perhaps other info.

* Okapi data: none
* Local state: none
* Child components: none

#### Loans

Read only access to this patron's loans (you'd check things back in /
renew them somewhere else right? though maybe not, people phone in)

* Okapi data: loans for this patron (R)
* Local state: none
* Child components: **LoanBrief**

##### LoanBrief

Used to render a loan passed in through props

* Okapi data: none
* Local state: none
* Child components: **ItemBrief**

#### Blocks

Renders

* Okapi data: Blocks (CRUD)
* Local state: none
* Child components: none

### SearchResults

This result list will have selection of multiple or all matching
patrons. It'll also pull more matches from the server than it displays
on screen -- turns out downloading a few hundred matches is snappier
than displaying them so we can out-fetch the pagination and have
records ready in advance so scrolling the list / hitting next page can
go faster than they might otherwise. That part will leverage something
from our component library for the list display, perhaps wrapping:
[https://bvaughn.github.io/react-virtualized/](https://bvaughn.github.io/react-virtualized/)

* Okapi data: patrons matching **:query** according to `?params`
  (sort-order, etc.)
* Local state: none
* Child components: **SearchResult**, some stuff to enable the batch
  operations (those components will need mutators for the associated
  data)

Questions:

* How does the windowed list view fetch additional records? How can we
  consume that component from the library, perhaps a callback

#### SearchResult

Some fields from the patron passed in via props, some controls for edit/delete and also a select toggle for batch operations.

* Okapi data: none
* Local state: toggle state indicating which records are to be
  affected by batch operations
* Child components: perhaps some controls from the batch operation

## Appendix: issues to be discussed

* Different fields/controls displayed depending on permissions
* Service discovery -- holds/loans only displayed if the Circulation
  backend is enabled -- libraries that don't circulate still have
  patrons.
* Validation + error display -- seeded by backend JSON schema and
  augmented locally for client-side validation, we can also do
  server-side validation where the backend can check it too (eg. is
  this a valid branch name in our 123 branch public library?)
* Configuration -- maybe the `patron` module has some settings users can
  persist to a backend like the default sort order? And maybe the
  admin can configure some default-defaults that get used if these
  aren't there?
* Mechanism for modules that somehow augment patron records with
  additional fields to also surface them in this UI. For example, a
  `patron-demographics` module might want to add sex, ethnicity and
  religion fields to the patron record.
* Might patrons and users potentially be the same entity? If so then
  we'll need to add permissions/groups
* Multiple panes mean we're going to need to split state out for
  component instances, just as well really
* Really wonder what the URLs are going to look like for this system,
  will need to ask Filip about that next week

And Jakub asks:

* I am assuming we would have a collection of generic, re-usable, base
  components (e.g controls that allow one to build multiple panes of
  the Finder-like design which Filip seemed to have put all over the
  place, the recent apps, bar, settings pane, etc) and specific ones
  (e.g user management pane) that inherit control’s behaviour and fill
  in the content through the manifest configuration and specific
  labels (we probably need a notion of "string resources" here)?

