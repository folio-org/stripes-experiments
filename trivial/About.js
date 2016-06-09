import React, { Component } from 'react';
import { connect } from 'stripes-connect';
class About extends Component {
  static dataQuery = { greetingParams: {} };
  componentWillMount() {
    this.props.mutator.greetingParams.replace({ greeting: 'Hi', name: 'Kurt' });
  }
  handleSubmit(e) {
    let replacement = { greeting: document.getElementById('g').value,
                        name: document.getElementById('n').value };
    console.log(replacement);
    this.props.mutator.greetingParams.replace(replacement);
  }
  render() {
    console.log('RENDR ABOUT');
    console.log(this.props);
    let greeting;
    if (this.props.greetingParams) {
      greeting = <h3>{this.props.greetingParams.greeting} {this.props.greetingParams.name}</h3>
    } else {
      greeting = <h3>No one here :(</h3>
    }
    return <div>
        {greeting}
        <form ref='form' onSubmit={this.handleSubmit.bind(this)}>
          Greeting: <input id='g' type='text' />
          Person: <input id='n' type='text' />
          <button type="submit">Greet</button>
        </form>
      </div>
  }
}
export default connect(About, 'trivial');
