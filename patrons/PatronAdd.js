import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';

export default class PatronAdd extends Component {
  static manifest = { 'apis/patrons': {remote: true} };

  createPatron(data, dispatch, e) {
    this.props.mutator['apis/patrons'].create(data);
  }

  cancel(data, dispatch, e) {
  	console.log("cancelling create");
  }

  render() { 
      return <PatronForm onSubmit={this.createPatron.bind(this)} 
                         cancelForm={this.cancel}  />
  }
}

export default connect(PatronAdd, 'patrons');
