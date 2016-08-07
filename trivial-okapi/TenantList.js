import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class TenantList extends Component {

  static manifest = {
    '_/proxy/tenants': { type: 'okapi' }
  };

  render() {
    if (!('_/proxy/tenants' in this.props.data)) return null;
    var tenantNodes = this.props.data['_/proxy/tenants'].map((tenant) => {
      return (
        <li key={tenant.id}>
          {tenant.name} [<a onClick={() => this.props.mutator['_/proxy/tenants'].delete(tenant)}>delete</a>]
          [<Link to={'/trivial-okapi/edit/' + tenant.id}>Edit</Link>] 
        </li>
      );
    });
    return (
      <div>
        <h3>Tenant list:</h3>
        <ul>
          {tenantNodes}
        </ul>
      </div>
    );
  }
}
export default connect(TenantList, 'trivial-okapi');
