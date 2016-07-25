import React, { Component } from 'react';
import { Field } from 'redux-form';
import { connectForm } from 'stripes-connect/connect-form';

class TrivialForm extends Component {
  static manifest = { greetingParams: {} };

  componentWillMount() {
    // this.props.mutator.greetingParams.replace({ greeting: 'Hi', name: 'Kurt' });
  }

  render() {
    console.log('DOM INPUT');
    console.log(React.DOM.input);
    // const { handleSubmit } = this.props;
    let greeting;
    if (this.props.greetingParams) {
      greeting = <h3>{this.props.greetingParams.greeting} {this.props.greetingParams.name}</h3>
    } else {
      greeting = <h3>No one here :(</h3>
    }
    return <div>
        {greeting}
        <form ref='form'>
          <div>
            <label>Person to greet</label>
            // <Field name='nsaldfkjame'/>
            // <Field name='name' component='input' type='text'/>
          </div>
          <button type='submit'>Greet</button>
        </form>
      </div>
  }
}
export default connectForm(TrivialForm, 'trivial-form');
        // <form ref='form' onSubmit={handleSubmit}>
        //   <div>
        //     <label>Person to greet</label>
        //     <Field name='name' component={React.DOM.input} type='text'/>
        //   </div>
        //   <button type='submit'>Greet</button>
        // </form>
