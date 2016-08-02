import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class PatronList extends Component {

  static manifest = { 'apis/patrons': { remote: true,
                                        pk: '_id',
                                        records: 'patrons'
                                      }};

  render() {
    if (!('apis/patrons' in this.props.data)) return null;
    var patronNodes = this.props.data['apis/patrons'].map((patron) => {
      return (
        <li key={patron.id}>
          {patron.patron_name} [<a onClick={() => this.props.mutator['apis/patrons'].delete(patron)}>delete</a>]
                               &nbsp;[<Link to={'patrons/edit/' + patron._id}>edit</Link>]
        </li>
      );
    });
    return (
      <div>
        <h3>Patron list:</h3>
        <ul>
          {patronNodes}
        </ul>
        [<Link to={'patrons/add'}>add patron</Link>]
      </div>
    );
  }
}
export default connect(PatronList, 'patrons');
