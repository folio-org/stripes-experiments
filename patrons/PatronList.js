import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class PatronList extends Component {

  static manifest = { 'apis/patrons': { remote: true,
                                        overrides: { 
                                          key: '_id', 
                                          headers: {
                                           'X-Okapi-Tenant': 'tenant-id',
                                           'Accept': 'application/json',
                                           'Content-Type': 'application/json',
                                           'Authorization': 'x'
                                          }
                                        }
                                      }
                    };

  render() {
    if (!('apis/patrons' in this.props.data)) return null;
    var patronNodes = this.props.data['apis/patrons'].map((patron) => {
      return (
        <li key={patron.id}>
          {patron.patron_name} 
        </li>
      );
    });
    return (
      <div>
        <h3>Patron list:</h3>
        <ul>
          {patronNodes}
        </ul>
        <Link to={'patrons/add'}>Add patron</Link>
      </div>
    );
  }
}
export default connect(PatronList, 'patrons');
