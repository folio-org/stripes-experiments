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

  createPatron(data, dispatch, e) {
    data.contact_info = {};
    data.patron_code = {};
    data.patron_local_id= "xyz";
    this.props.mutator['apis/patrons'].create(data);
    this.context.router.push('/patrons/list');
  }

  cancel(data, dispatch, e) {
  	console.log("cancelling create");
  }

  render() { 
      return <PatronForm onSubmit={this.createPatron.bind(this)} 
                         cancelForm={this.cancel} />
  }
}

export default connect(PatronAdd, 'patrons');
