Stripes: a modular toolkit for user interfaces
==============================================

Introduction
------------

Stripes is part of the [Folio](http://www.folio.org/) project, which
is building an open library services platform. The goal of Folio is
that third-party developers will be able to contribute moduls that
slide easily into place as part of a library' IT infrastructure -- for
example, an acquisitions module or integration with an institutional
respository.

Folio modules run on clouds of servers -- either hosted commercially
by SAAS providers like EBSCO, or hosted locally by institutions that
prefer to take on this kind of infrastructure work. These modules
provide their services via RESTful APIPs. But the way Folio
functionality is exposed to users (whether librarians, administrators
or patrons) is in a Web browser. Each Folio module is fronted by a
Stripes module which makes its functionality available to users.

> (Actually, that's a bit of a simplification. A given Folio module
> may be represented more than one Stripes module. for example, two
> different Stripes Loads modules might present different views of the
> loan process, one more suited to academic libraries and one to
> public libraries. Then anotber vendor might come along and offer a
> third alternative: a slicker public-library loans UI to compete with
> the existing one. Stripes allows different alternative modules to be
> slipped into place.)


Software Overview
-----------------

As so often in programming, the price of simplicity is complexity. To
make modules neatly pluggable like this, we have to do a lot of work
behind the scenes, and as a result Stripes is not the easiest piece of
software to get to grips with.

At present, Stripes itself consists of three modules, each of them
packaged using NPM:

* [**stripes-core**](https://github.com/sling-incubator/stripes-experiments/tree/master/stripes-core):
  the core of system, including the web-application's
  `index.html` and `index.js`. Also includes some utilities that are
  used by the other modules.

* [**stripes-connect**](https://github.com/sling-incubator/stripes-experiments/tree/master/stripes-connect):
  Code that connects Stripes modules with sources of data, notably the
  Okapi middleware that exposes Folio services.

* [**stripes-loader**](https://github.com/sling-incubator/stripes-loader):
  A Webpack loader that gathers and configures the selected set of
  modules that will make up a particular Stripes application.

Besides these core modules, there are a small number of Stripes
modules available for inclusion in applicatiobs. At present these are
strictly proof of concept modules, and do not do anything useful:

* [**trivial**](https://github.com/sling-incubator/stripes-experiments/tree/master/trivial):
  A "hello world" module that can express various greetings to
  different people.

Going forward, it's possible that the Stripes code will be split into
more modules -- for example, we may separate out the code for
communicating with Okapi. And it is a certainty that there will be
many more application modules, including those created by other
parties.


How it all ties together
------------------------

Hold on to your hats -- this is s bit complicated.

* NPM is the Node Package Manager. Although it started out as part of
  Node, it's now more or less the universally used mechanism for
  distributing packages of JavaScript code. When NPM builds a package,
  it uses various tools including Webpack.

* Webpack is a module bundler. It takes the many separate JavaScript,
  HTML and CSS files that make up a typical JavaScript library, and
  bundles them into one or more "static assets". At its very simplest,
  it just concatenates a bunch of JavaScript files into one.

* Webpack handles different kinds of files in different ways. For
  example, depending on how it's configured, it might run ES6 (modern
  JavaScript) through a translator called Babel to convert into and
  older version of JavaScript that runs in more browsers.

* The way Webpack does this is with "handlers". A Webpack handler a
  piece of code invoked by Webpack when it's compiling a set of
  resources down into static assets.

