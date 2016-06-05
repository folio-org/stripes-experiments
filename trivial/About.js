import React, { Component } from 'react';
import { connect } from 'stripes-connect';
class About extends Component {
  static dataQuery = { personToGreet: {} };
  componentWillMount() {
    this.props.mutator.personToGreet.replace({ name: 'Kurt' });
  }
  handleSubmit(e) {
    this.props.mutator.personToGreet.replace({ name: e.target.firstChild.value });
  }
  render() {
    console.log('RENDR ABOUT');
    console.log(this.props);
    let greeting;
    if (this.props.personToGreet) {
      greeting = <h3>Hi {this.props.personToGreet.name}</h3>
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
