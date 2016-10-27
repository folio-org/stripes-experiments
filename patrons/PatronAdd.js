import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';
import { actionTypes } from './PatronForm';

// One of multiple stripes-connected components in the patrons module
class PatronAdd extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  // The manifest is provided in components by the module developer and consumed by 'stripes connect'
  static manifest = { 'patrons': { type: 'okapi',
                                   pk: '_id',  // The primary key of records from this end-point
                                                    // Set this if not using the default, "id".
                                   clientGeneratePk: false, // Set this if the backend service requires
                                                                 // that it generates unique IDs for records
                                   records: 'patrons', // The name of the property in the JSON response
                                                           // that holds the records
                                   path: 'apis/patrons'
                                }};

  createPatron(data) {
    this.props.mutator['patrons'].POST(data);
    this.context.router.transitionTo('/patrons');
  }

  cancel(data) {
    this.context.router.transitionTo('/patrons');
  }

  render() {
      return <PatronForm onSubmit={this.createPatron.bind(this)}
                         cancelForm={this.cancel.bind(this)}
                         action={actionTypes['create']}/>
  }
}

// This function call might be implicit in a future version (invoked by the framework)
export default connect(PatronAdd, 'patrons');
