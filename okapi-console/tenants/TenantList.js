import React, { Component } from 'react';
import { connect } from 'stripes-connect';
import { Link } from 'react-router';

class TenantList extends Component {
  static manifest = {
    'tenants': { type: 'okapi',
                 path: '_/proxy/tenants' }
  };

  render() {
    const { data: {tenants} , mutator, pathname } = this.props;

    if (!tenants) return null;
    var tenantNodes = tenants.map((tenant) => {
      return (
        <li key={tenant.id}>
          {tenant.name}&nbsp;ID: {tenant.id}&nbsp; 
          [<Link to={`${pathname}/edit/${tenant.id}`}>Edit</Link>]
          [<a onClick={() => mutator.tenants.DELETE(tenant)}>delete</a>]
        </li>
      );
    });
    return (
      <div>
        <div>
        <h3>Tenant list:</h3>
        <ul>
          {tenantNodes}
        </ul>
        </div>
        <Link to={`${pathname}/add`}>Add tenant</Link>
      </div>
    );
  }
}

export default connect(TenantList, 'okapi-console');
