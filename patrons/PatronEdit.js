import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import PatronForm from './PatronForm';

export default class PatronEdit extends Component {

  static manifest = { 'apis/patrons': { remote: true,  
                                        pk: '_id',  // The primary key of records from this end-point
                                                    //  (when it's not the default, "id")
                                        path: ':patronid' // request parameter, provided by router
                                      }};

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  // Invokes the mutator provided by stripes connect to perform a PUT
  // Uses router object to navigate back to list
  updatePatron(data) {
    this.props.mutator['apis/patrons'].update(data);
    this.context.router.push('/patrons/list');
  }

  cancel(data) {
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
