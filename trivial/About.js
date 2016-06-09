import React, { Component } from 'react';
import { connect } from 'stripes-connect';
class About extends Component {
  static dataQuery = { greetingParams: {} };
  componentWillMount() {
    this.props.mutator.greetingParams.replace({ name: 'Kurt' });
  }
  handleSubmit(e) {
    this.props.mutator.greetingParams.replace({ name: e.target.firstChild.value });
  }
  render() {
    console.log('RENDR ABOUT');
    console.log(this.props);
    let greeting;
    if (this.props.greetingParams) {
      greeting = <h3>Hi {this.props.greetingParams.name}</h3>
    } else {
      greeting = <h3>No one here :(</h3>
    }
    return <div>
        {greeting}
        <form ref='form' onSubmit={this.handleSubmit.bind(this)}>
          <input type='text' /><button type="submit">Greet</button>
        </form>
      </div>
  }
}
export default connect(About, 'trivial');
