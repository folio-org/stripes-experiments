import React, { Component } from 'react';
import GraphiQL from 'graphiql';
// import './App.css';
import 'graphiql/graphiql.css';

const defaultURL = "http://127.0.0.1:9130"
const defaultQuery = '# Welcome to GraphiQL\n#\n# GraphiQL is an in-browser tool for writing, validating, and\n# testing GraphQL queries.\n#\n# Type queries into this side of the screen, and you will see intelligent\n# typeaheads aware of the current GraphQL type schema and live syntax and\n# validation errors highlighted within the text.\n#\n# GraphQL queries typically start with a "{" character. Lines that starts\n# with a # are ignored.\n#\n# An example GraphQL query might look like:\n#\n#     {\n#       field(arg: "value") {\n#         subField\n#       }\n#     }\n#\n# Keyboard shortcuts:\n#\n#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)\n#\n#       Run Query:  Ctrl-Enter (or press the play button above)\n#\n#   Auto Complete:  Ctrl-Space (or just start typing)\n#\n\nquery {\n  users {\n    id\n    username\n  }\n}\n\n';

class App extends Component {
  fetcher = (graphQLParams) => {
    const { okapi } = this.state;
    return fetch(`${okapi.url}/graphql`, {
      mode: 'cors',
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
      mode: 'cors',
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
        <GraphiQL fetcher={this.fetcher} defaultQuery={defaultQuery} />
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
