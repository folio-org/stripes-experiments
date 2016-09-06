# Testing the Okapi sample module from the POC UI

This is the old Proof-Of-Concept (POC) Okapi Console, retrofitted to
work over Stripes. You can get it running by following the steps in
[../README.md](../README.md).
Then you can follow these steps to set up some tenants and modules on
your local Okapi.

<!-- ../../okapi/doc/md2toc testing-the-sample-module.md -->
* [Testing the Okapi sample module from the POC UI](#testing-the-okapi-sample-module-from-the-poc-ui)
    * [Introduction](#introduction)
    * [Fetch, build and run Okapi and its modules locally](#fetch-build-and-run-okapi-and-its-modules-locally)
    * [Fetch and build the POC UI locally](#fetch-and-build-the-poc-ui-locally)
    * [Run the POC UI locally](#run-the-poc-ui-locally)
        * [Add the sample module](#add-the-sample-module)
            * [Clustered version](#clustered-version)
        * [Create the tenant and deploy the module to it:](#create-the-tenant-and-deploy-the-module-to-it)
        * [Run the sample module](#run-the-sample-module)
        * [Check the health of the running module](#check-the-health-of-the-running-module)

## Introduction

Two pieces of software are involved here: Okapi (with its modules,
including the sample module); and the proof-of-concept user
interface. To exercise the sample module from the POC UI, it's
necessary to install, build and run both pieces of software. Then it
is possible to run the UI in a browser.

Alternatively it's possible to run an existing UI and Okapi in a CI
installation on an AWS cluster by pointing a browser to
[`http://redux-okapi-test-aws.indexdata.com/`](http://redux-okapi-test-aws.indexdata.com/)
For that the steps to fetch and build Okapi and the UI can be skipped.

## Fetch, build and run Okapi and its modules locally

In a shell window, run:

    shell1$ git clone git@github.com:folio-org/okapi.git
    shell1$ cd okapi
    shell1$ mvn install
    shell1$ mvn exec:exec

Re-running Okapi in this way (`mvn exec:exec`) gives a new instance of
Okapi with no state left over from earlier runs. This allows the POC
UI to run against a known state.

## Fetch and build the POC UI locally

    shell2$ git clone git@github.com:folio-org/stripes-experiments.git
    shell2$ cd stripes-experiments

Then follow the instructions in `README.md`, which are currently in flux.

## Run the POC UI locally

Point your browser to [`http://localhost:3000`](http://localhost:3000)
to see the POC UI home page.

Alternatively, run the POC UI remotely, in the AWS cluster (see below
for how to configure the cluster). To do this, point your browser to
[`http://redux-okapi-test-aws.indexdata.com/`](http://redux-okapi-test-aws.indexdata.com/)
to see the POC UI home page.


### Add the sample module

First, fill in the **module proxy** section:

* Click the **Okapi Modules** menu item at the top of the page.
* Click **Add module**.
* Fill in the **Name** textbox with `Sample Module` (or any name).
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

#### Clustered version

Alternatively, deploy the module remotely to the three nodes of the AWS cluster:

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

### Create the tenant and deploy the module to it:

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

### Run the sample module

XXX Note: this facility seems to have gone away in the present console.

* Click the **Sample Module** menu item at the top of the page. You
  will see the list of tenants for which to run the module, currently
  consisting of only one entry for Our Library.
* Click the **Invoke sample-module as this tenant** link next to Our
  Library.

The caption by the testing link changed from **Not tested yet** to
**It works**.

### Check the health of the running module

* Click the **Okapi Health** menu item at the top of the page. You will see
  a list of running modules, currently only the Sample Module.

