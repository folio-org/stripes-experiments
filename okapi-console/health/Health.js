import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class Row extends Component {
  render() {
    let h = this.props.h;
    let href = "#/okapi-console/modules/edit/" + h.srvcId;
    return <tr>
      <td>{h.instId}</td>
      <td><a href={href}>{h.srvcId}</a></td>
      <td>{this.props.map[h.srvcId]}</td>
      <td>{h.healthMessage}</td>
      <td>{h.healthStatus ? "true" : "false"}</td>
    </tr>
  }
}

export default class Health extends Component {
  componentDidMount() {
    // This is likely not how 'system' is supposed to be retrieved
    // if system is supposed to be accessible at all. But then again
    // this component is just for illustration of a non-stripes-connected
    // Okapi UI vs a stripes-connected one. 
    let system = require('stripes-loader!');
    fetch(system.okapi.url + '/_/discovery/health', {}).
     then((response) => {
      if (response.status != 200) {
        console.log('health fetch error ' + response.status);
        this.setState({ health: "error " + response.status });
      } else {
        console.log('health fetch success ' + response.status);
        response.json().then((json) => {
          this.setState({ health: json });
        });
      }
    });
    fetch(system.okapi.url + '/_/proxy/modules', {}).
     then((response) => {
      if (response.status != 200) {
        console.log('modules fetch error ' + response.status);
        this.setState({ health: "error " + response.status });
      } else {
        console.log('modules fetch success ' + response.status);
        response.json().then((json) => {
          this.setState({ modules: json });
        });
      }
    });
  }

  render() {
    if (!this.state) {
      return <div/>
    }

    let health = this.state.health;
    if (!health) {
      return <div/>
    }

    let modules = this.state.modules;
    console.log("Health.render: ",
                "health = " + typeof(health) + ": ", health, "; ",
                "modules = " + typeof(modules) + ": ", modules);
    let moduleId2name = {};
    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        let module = modules[i];
        moduleId2name[module.id] = module.name;
      }
    }

    return <table>
             <thead>
              <tr>
               <th>Instance ID</th>
               <th>Service ID</th>
               <th>Module Name</th>
               <th>Message</th>
               <th>Status</th>
              </tr>
             </thead>
             <tbody>
              {health.map((h, index) => { return <Row key={index} h={h} map={moduleId2name}/> })}
             </tbody>
            </table>
  }
}
