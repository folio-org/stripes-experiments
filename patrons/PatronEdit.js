import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';

export default class PatronEdit extends Component {

  static manifest = { 'apis/patrons': { remote: true,  // get data from Okapi
                                        pk: '_id',     // primary key of records from apis/patrons
                                        path: ':patronid',
                                        headers: {
                                          "Authorization": "x"
                                        }
                                      }
                    };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  // Invokes the mutator provided by connect to perform a PUT
  // Uses router object to navigate back to list
  updatePatron(data) {
    this.props.mutator['apis/patrons'].update(data);
    this.context.router.push('/patrons/list');
  }

  cancel(data) {
    console.log("cancelling edit");
    this.context.router.push('/patrons/list');
  }

  render() { 
      let patronid = this.props.params.patronid;
      let patrons = this.props.data['apis/patrons']
      let patron = patrons.find((patron) =>  { return patron._id === patronid });

      return <PatronForm onSubmit={this.updatePatron.bind(this)} 
        cancelForm={this.cancel.bind(this)}
        action={PatronForm.actionTypes['update']}
        initialValues={patron} />
  }
}

export default connect(PatronEdit, 'patrons');
