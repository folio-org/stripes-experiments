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
    console.log(this.props);
    const { data, mutator, pathname } = this.props;
    if (!data.tenants) return null;
    var tenantNodes = data.tenants.map((tenant) => {
      return (
        <li key={tenant.id}>
          {tenant.name} [<a onClick={() => mutator.tenants.DELETE(tenant)}>delete</a>]
          [<Link to={`${pathname}/edit/${tenant.id}`}>Edit</Link>] 
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
