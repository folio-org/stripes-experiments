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
          {tenant.name}&nbsp;ID: {tenant.id}&nbsp; 
          [<Link to={'/okapi-console/tenants/edit/' + tenant.id}>Edit</Link>] 
          [<a onClick={() => this.props.mutator['_/proxy/tenants'].delete(tenant)}>delete</a>]
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
        <Link to={'/okapi-console/tenants/add'}>Add tenant</Link>
      </div>
    );
  }
}

export default connect(TenantList, 'okapi-console');
