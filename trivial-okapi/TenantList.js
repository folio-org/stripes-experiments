import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class TenantList extends Component {

  static manifest = {
    'tenants': {
      path: '_/proxy/tenants',
      type: 'okapi'
    }
  };

  render() {
    if (!this.props.data.tenants) return null;
    var tenantNodes = this.props.data.tenants.map((tenant) => {
      return (
        <li key={tenant.id}>
          {tenant.name} [<a onClick={() => this.props.mutator.tenants.DELETE(tenant)}>delete</a>]
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
