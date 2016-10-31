# Testing the FOLIO circulation module from the Okapi Console

<!-- pandoc -f markdown_github-hard_line_breaks testing-the-circulation-module.md > testing-the-circulation-module.html -->
<!-- ../../okapi/doc/md2toc -l 2 testing-the-circulation-module.md -->
* [Introduction](#introduction)
* [Server side](#server-side)
    * [Fetch, build and run Okapi](#fetch-build-and-run-okapi)
    * [Fetch and build the RAML tools](#fetch-and-build-the-raml-tools)
    * [Fetch and build the circulation module](#fetch-and-build-the-circulation-module)
* [Client side](#client-side)
    * [Fetch and build the Okapi Console locally](#fetch-and-build-the-okapi-console-locally)
    * [Configure the Okapi Console](#configure-the-okapi-console)
    * [Run the Okapi Console locally](#run-the-okapi-console-locally)
        * [Add the circulation module](#add-the-circulation-module)
        * [Create the tenant and deploy the module to it:](#create-the-tenant-and-deploy-the-module-to-it)
        * [Check the health of the running module](#check-the-health-of-the-running-module)
        * [Run the patrons module](#run-the-patrons-module)
* [Appendix: deploying modules on clustered Okapi](#appendix-deploying-modules-on-clustered-okapi)


## Introduction

Two sets of software are involved here: on the server side, Okapi with
its modules, including the circulation module; and on the client
side, the Stripes-based Okapi Console, including the patron
module. (Patron maintenance is one of the responsibilities of the
server-side circulation module; a single UI module is dedicated to
this function.)

To exercise the circulation module from the Okapi Console, it's
necessary to install, build and run both pieces of software. Then it
is possible to run the UI in a browser.

(Alternatively you can use an existing UI and Okapi in a CI
installation on an AWS cluster by pointing a browser to
[`http://redux-okapi-test-aws.indexdata.com/`](http://redux-okapi-test-aws.indexdata.com/)
For that, the steps to fetch and build Okapi and the UI can be
skipped. See the Appendix for how module deployment is done in this
context.)

## Server side

### Fetch, build and run Okapi

In a shell window, run:

    shell1$ git clone https://github.com/folio-org/okapi.git
    shell1$ cd okapi
    shell1$ mvn install
    shell1$ mvn exec:exec

Stopping and re-running Okapi in this way (`mvn exec:exec`) gives a
new instance of Okapi with no state left over from earlier runs. This
allows the Okapi Console to run against a known state.

### Fetch and build the RAML tools

These tools are needed to build the circulation module.

    shell2$ git clone https://github.com/folio-org/raml-module-builder.git
    shell2$ cd raml-module-builder
    shell2$ mvn install
    shell2$ cd ..

### Fetch and build the circulation module

We just build this: Okapi will start it for us when needed.

    shell2$ git clone https://github.com/folio-org/mod-circulation.git
    shell2$ cd mod-circulation
    shell2$ mvn install
    shell2$ cd ..

The most important output is
`mod-circulation/target/circulation-fat.jar`, which we will later be
asking Okapi to run for us.

## Client side

### Fetch and build the Okapi Console locally

This is the old Proof-Of-Concept (PoC) UI Console, retrofitted to
work over Stripes.

    shell2$ git clone https://github.com/folio-org/stripes-experiments.git
    shell2$ cd stripes-experiments

Then follow the instructions in its
[`stripes-core/README`](../stripes-core/README.md#very-quick),
(which are currently somewhat in flux) or, if you are a developer
running the Stripes code from a git checkout, use the instructions in
[the Developer Guide](../stripes-core/doc/building-from-git-checkouts.md).

### Configure the Okapi Console

You will need to enable additional Stripes modules besides the
default `trivial` module. Edit
`stripes-experiments/stripes-core/webpack.config.cli.js`
to uncomment the commented-out modules in the `stripesLoader/modules`
configuration element:

    '@folio-sample-modules/trivial': {},
    '@folio-sample-modules/trivial-okapi': {},
    '@folio-sample-modules/okapi-console': {},
    '@folio-sample-modules/patrons': {}

You will also need to ensure that the relevant modules are visible to
`stripes-loader` in the `@folio-sample-modules` namespace:

    shell2$ cd ../../stripes-loader/node_modules/@folio-sample-modules
    shell2$ ln -s ../../../stripes-experiments/trivial-okapi
    shell2$ ln -s ../../../stripes-experiments/okapi-console
    shell2$ ln -s ../../../stripes-experiments/patrons
    shell2$ cd ../../../stripes-experiments/stripes-core

Now you can re-run the UI server in the `stripes-core` directory, so
that it rebuilds the package with the freshly uncommented modules
included:

    shell2$ npm run start

### Run the Okapi Console locally

Point your browser to [`http://localhost:3000`](http://localhost:3000)
to see the Okapi Console home page.


#### Add the circulation module

First, fill in the **module proxy** section:

* Click the **Okapi Modules** menu item at the top of the page.
* Click **Add module**.
* Fill in the **Name** textbox with `Circulation` (or any name).
* You can ignore the **Provides** and **Requires** entries for our present purposes.
* Click the **+Add route** button next to the **Routing** heading.
* Click the new **+Add HTTP method** button that has appeared to the right
  of the new **Methods** caption.
* Type `GET` into the **Methods** box.
* Click the **+** button to the right of this box.
  Another empty **Methods** box appears below the one you filled in.
* Type `POST` into the new **HTTP method** box.
  Another empty **Methods** box appears below the one you filled in.
* Type `PUT` into the new **HTTP method** box.
  Another empty **Methods** box appears below the one you filled in.
* Type `DELETE` into the new **HTTP method** box.
  (Another empty **Methods** box appears below the one you filled in. Ignore it.)
* Fill in the three elements of the routing entry as follows:
    * Request path: `/apis`
    * Priority level: `30`
    * Type: `request-response`
* Click the **+** button to the right of the routing entry. (Another
  empty routing entry appears below the one you filled in. Ignore it.)
* Click the **Add module proxy** button below the routing entries.

Now deploy the module locally to the running Okapi node:

* Click the **Edit** link for the newly-added patrons module.
* Pull down the **Node** dropdown (below the **Service ID** and **Inst ID** read-only textboxes), and select the only value that is
  presented, `http://localhost:9130/`.
* Fill in the **Exec** entry with the following command-line, which
  Okapi will use to start the circulation module:
  `java -jar ../mod-circulation/target/circulation-fat.jar -Dhttp.port=%p embed_mongo=true`
* You can ignore the **Start command** and **Stop command** entries in this scenario.
* Press the **Submit** button at bottom right. (Another empty
  deployment entry appears below the one you filled in. Ignore it.)

#### Create the tenant and deploy the module to it:

**NOTE.** At present, the patrons UI module is hardwired to use the
tenant-id `tenant-id`. Therefore, we need to hand-install a tenant
with that ID in order for the module to work, rather than creating one
using the Console. We can do this using the command-line HTTP client
curl:

    curl -D - -X POST  -H "Content-Type: application/json" http://localhost:9130/_/proxy/tenants -d '{
      "id" : "tenant-id",
      "name" : "T1",
      "description" : "Tenant 1"
    }'

In a better world, we would create the tenant as follows:

* Click the **Okapi Tenants** menu item at the top of the page. You will see
  the list of tenants, which is presently empty.
* Click **Add tenant**.
* Fill in the **Name** textbox with `Our Library` (or any name).
* Click the **Add Tenant** button. You will be redirected to the list
  of tenants, which will now have one entry, Our Library.

Either way, we now have a tenant list showing a single tenant. To
enable the module for that tenant follow these steps:

* Click the **[Edit]** link next to the sole tenant. A list of modules
  that are available to the tenant is shown at the bottom, currently
  consisting of only one entry for the Circulation Module.
* Click the **Enable** link next to Circulation Module. The link changes to
  **[X]**.

#### Check the health of the running module

* Click the **Okapi Health** menu item at the top of the page. You will see
  a list of running modules, currently only the Circulation Module.

#### Run the patrons module

* Click the **Patrons** menu item at the top of the page. You will see
  a list of existing patrons (currently empty) and an **[add patron]**
  link.
* Click the **add patron** link.
* The **Add Patron** form appears.
* This form has 36 entries! Fill them all in. (I use the letters
  `a`..`z` and the digits `0`..`9`.
* Click the **Save Patron** button at the bottom.

The result _should_ be that we return to the patron list, and this
time see the newly-added patron on the list.

XXX At present this does not seem to work: the POST operation that
should create the new patron is rejected with a 404 Not Found.


## Appendix: deploying modules on clustered Okapi

Instead of building and running Okapi and the modules locally, it is
possible to use the continuous-integration clustered Okapi instance,
deploying the module remotely to the three nodes of the AWS
cluster. In the **Okapi Modules** tab:

* Pull down the **Node** dropdown, and select one of the nodes, for example
  the one labelled `http://okapi-test1.aws.indexdata.com:9130`.
* Fill in the **Start command** entry with the following command-line, which
  Okapi will use to start the sample module. Substitute PASSWORD with the
  actual password to use:
  `docker login -u indexdata -p PASSWORD -e ' ' docker.indexdata.com:5000 && docker run -d --cidfile=/tmp/docker.%p.cid -p %p:8080 docker.indexdata.com:5000/okapi-sample-module:0.3`
* Fill in the **Stop command** entry with the following command-line, which
  Okapi will use to stop the sample module:
  ``docker stop `cat /tmp/docker.%p.cid` && docker rm `cat /tmp/docker.%p.cid` && rm -f /tmp/docker.%p.cid``
* Press the **Submit** button at bottom right. An orange **Delete** button
  and another empty deployment entry appear below the one you filled in.
* In this new entry, select one of the other two nodes in the **Node** dropdown, 
  for example the one labelled `http://okapi-test2.aws.indexdata.com:9130`. 
  Fill in the Start command and Stop command with the same values as for the 
  first node.
* Press the **Submit** for this second entry and a third empty entry appears.
* Fill in the third entry like the first two and press the **Submit** button.

