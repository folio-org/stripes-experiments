import React, { Component } from 'react';
import GraphiQL from 'graphiql';
// import './App.css';
import 'graphiql/graphiql.css';

const defaultURL = "http://127.0.0.1:9130"

class App extends Component {
  fetcher = (graphQLParams) => {
    const { okapi } = this.state;
    return fetch(`${okapi.url}/graphql`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  handleForm = (e) => {
    e.preventDefault();
    let okapi = {
      url: this.refs.url.value,
      tenant: this.refs.tenant.value,
    };
    let creds = {
      username: this.refs.name.value,
      password: this.refs.password.value,
    };
    fetch(`${okapi.url}/bl-users/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Okapi-Tenant': okapi.tenant,
      },
      body: JSON.stringify(creds),
    }).then(response => {
     if (response.status >= 400) {
       this.setState({ error:true })
     } else {
       okapi.token = response.headers.get('X-Okapi-Token');
       this.setState({ error: false, okapi });
     }
    });
  }

  render() {
    if (this.state && this.state.okapi) {
      return (
        <GraphiQL fetcher={this.fetcher} />    
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Okapi GraphiQL</h1>
        </header>
        <div>
          <p>
            <label>Username</label> 
            <input type="text"
                   ref="name"
                   defaultValue="diku_admin" />
          </p> 
          <p>
            <label>Password</label>
            <input type="password"
                   ref="password" />
          </p>
          <p>
            <label>Okapi URL</label>
            <input type="text"
                   ref="url"
                   defaultValue={ defaultURL } />
          </p>
          <p>
            <label>Tenant</label>
            <input type="text"
                   ref="tenant"
                   defaultValue="diku" />
          </p>

          <button onClick={ this.handleForm }>Start GraphiQL!</button></div>
      </div>
    );
  }
}

export default App;
