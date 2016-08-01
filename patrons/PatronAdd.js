import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';

export default class PatronAdd extends Component {
  static contextTypes = {
    router: PropTypes.func.isRequired
  };

  static manifest = { 'apis/patrons': { remote: true,
                                        pk: '_id',
                                        clientGeneratePk: false,
                                        records: 'patrons',
                                        headers: {
                                          "X-Okapi-Tenant": "tenant-id",
                                          "Authorization": "x"
                                        }
                                      }
                    };

  createPatron(data) {
    this.props.mutator['apis/patrons'].create(data);
    this.context.router.push('/patrons/list');
  }

  cancel(data) {
    console.log("cancelling create");
    this.context.router.push('/patrons/list');
  }

  render() { 
      return <PatronForm onSubmit={this.createPatron.bind(this)} 
                         cancelForm={this.cancel} 
                         action={PatronForm.actionTypes['create']}/>
  }
}

export default connect(PatronAdd, 'patrons');
