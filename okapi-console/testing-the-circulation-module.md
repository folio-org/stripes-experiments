# Testing the FOLIO circulation module from the Okapi Console

<!-- ../../okapi/doc/md2toc -l 2 testing-the-circulation-module.md -->
* [Introduction](#introduction)
* [Server side](#server-side)
    * [Fetch, build and run Okapi](#fetch-build-and-run-okapi)
    * [Fetch and build the RAML tools](#fetch-and-build-the-raml-tools)
    * [Fetch and build the circulation module](#fetch-and-build-the-circulation-module)
* [Client side](#client-side)
    * [Fetch and build the Okapi Console locally](#fetch-and-build-the-okapi-console-locally)
    * [Run the Okapi Console locally](#run-the-okapi-console-locally)
        * [Add the circulation module](#add-the-circulation-module)
        * [Create the tenant and deploy the module to it:](#create-the-tenant-and-deploy-the-module-to-it)
        * [Run the sample module](#run-the-sample-module)
        * [Check the health of the running module](#check-the-health-of-the-running-module)
* [Appendix: deploying modules on clustered Okapi](#appendix-deploying-modules-on-clustered-okapi)

## Introduction

Two sets of software are involved here: on the server side, Okapi with
its modules, including the circulation module; and on the the client
side, the Stripes-based Okapi Console. To exercise the circulation
module from the Okapi Console, it's necessary to install, build and
run both pieces of software. Then it is possible to run the UI in a
browser.

(Alternatively you can an existing UI and Okapi in a CI
installation on an AWS cluster by pointing a browser to
[`http://redux-okapi-test-aws.indexdata.com/`](http://redux-okapi-test-aws.indexdata.com/)
For that the steps to fetch and build Okapi and the UI can be
skipped. See the Appendix for how module deployment is done in this
context.)

## Server side

### Fetch, build and run Okapi

In a shell window, run:

    shell1$ git clone git@github.com:folio-org/okapi
    shell1$ cd okapi
    shell1$ mvn install
    shell1$ mvn exec:exec

Stopping and re-running Okapi in this way (`mvn exec:exec`) gives a
new instance of Okapi with no state left over from earlier runs. This
allows the Okapi Console to run against a known state.

### Fetch and build the RAML tools

These tools are needed to build the circulation module.

    shell2$ git clone git@github.com:folio-org/raml-module-builder
    shell2$ cd raml-module-builder
    shell2$ mvn install
    shell2$ cd ..

### Fetch and build the circulation module

We just build this: Okapi will start it for us when needed.

    shell2$ git clone git@github.com:folio-org/mod-circulation
    shell2$ cd mod-circulation
    shell2$ mvn install
    shell2$ cd ..

## Client side

### Fetch and build the Okapi Console locally

This is the old Proof-Of-Concept (POC) UI Console, retrofitted to
work over Stripes.

    shell2$ git clone git@github.com:folio-org/stripes-experiments
    shell2$ cd stripes-experiments

Then follow the instructions in its
[`README`](../README.md),
which are currently in flux.

### Run the Okapi Console locally

Point your browser to [`http://localhost:3000`](http://localhost:3000)
to see the Okapi Console home page.


#### Add the circulation module

First, fill in the **module proxy** section:

* Click the **Okapi Modules** menu item at the top of the page.
* Click **Add module**.
* Fill in the **Name** textbox with `Circulation` (or any name).
* You can ignore the **Provides** and **Requires** entries for our present purposes.
* Click the **+Add entry** button next to the **Routing** heading.
* Click the new **+Add entry** button that has appeared to the right
  of the new **Methods** caption.
* Type `GET` into the **HTTP method** box.
* Click the **+** button to the right of this box. (Another
  empty **HTTP method** box appears below the one you filled in. Ignore it.)
* Fill in the three elements of the routing entry as follows:
    * Request path: `/sample`
    * Priority level: `30`
    * Type: `request-response`
* Click the **+** button to the right of the routing entry. (Another
  empty routing entry appears below the one you filled in. Ignore it.)
* Click the **Add module proxy** button below the routing entries.

Now deploy the module locally to the running Okapi node:

* Pull down the **Node** dropdown (below the **Service ID** and **Inst ID** read-only textboxes), and select the only value that is
  presented, `http://localhost:9130/`.
* Fill in the **Exec** entry with the following command-line, which
  Okapi will use to start the sample module:
  `java -Dport=%p -jar okapi-sample-module/target/okapi-sample-module-fat.jar`
* You can ignore the **Start command** and **Stop command** entries in this scenario.
* Press the **Submit** button at bottom right. (Another empty
  deployment entry appears below the one you filled in. Ignore it.)

#### Create the tenant and deploy the module to it:

* Click the **Okapi Tenants** menu item at the top of the page. You will see
  the list of tenants, which is presently empty.
* Click **Add tenant**.
* Fill in the **Name** textbox with `Our Library` (or any name).
* Click the **Add Tenant** button. You will be redirected to the list
  of tenants, which will now have one entry, Our Library.
* Click the **[Edit]** link next to Our Library. A list of modules
  that are available to the tenant is shown at the bottom, currently
  consisting of only one entry for the Sample Module.
* Click the **Enable** link next to Sample Module. The link changes to
  **[X]**.

#### Run the sample module

XXX Note: this facility seems to have gone away in the present console.

* Click the **Sample Module** menu item at the top of the page. You
  will see the list of tenants for which to run the module, currently
  consisting of only one entry for Our Library.
* Click the **Invoke sample-module as this tenant** link next to Our
  Library.

The caption by the testing link changed from **Not tested yet** to
**It works**.

#### Check the health of the running module

* Click the **Okapi Health** menu item at the top of the page. You will see
  a list of running modules, currently only the Sample Module.


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
* In this new entry, select one of the other two nodes in the **Node** dropwdown, 
  for example the one labelled `http://okapi-test2.aws.indexdata.com:9130`. 
  Fill in the Start command and Stop command with the same values as for the 
  first node.
* Press the **Submit** for this second entry and a third empty entry appears.
* Fill in the third entry like the first two and press the **Submit** button.

