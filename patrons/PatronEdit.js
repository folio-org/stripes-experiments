import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';

export default class PatronEdit extends Component {
  static contextTypes = {
    router: PropTypes.func.isRequired
  };

  static manifest = { 'apis/patrons': { remote: true,
                                        pk: '_id',
                                        clientGeneratePk: false,
                                        path: ':patronid',
                                        headers: {
                                          "X-Okapi-Tenant": "tenant-id",
                                          "Authorization": "x"
                                        }
                                      }
                    };

  updatePatron(data) {
    this.props.mutator['apis/patrons'].update(data);
    this.context.router.push('/patrons/list');
  }

  cancel(data) {
    console.log("cancelling edit");
    this.context.router.push('/patrons/list');
  }

  render() { 
      return <PatronForm onSubmit={this.updatePatron.bind(this)} 
        cancelForm={this.cancel.bind(this)}
        action={PatronForm.actionTypes['update']}
        initialValues=
          {this.props.data['apis/patrons']
           .find((patron) => { return patron._id === this.props.params.patronid })} />
  }
}

export default connect(PatronEdit, 'patrons');
