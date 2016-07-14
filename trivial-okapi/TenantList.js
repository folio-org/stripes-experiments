import React, { Component } from 'react';
import { connect } from 'stripes-connect';

class StripesComponent extends Component {
  componentDidMount() {
    this.props.refreshRemote();
  }
}

class TenantList extends StripesComponent {
  static manifest = { tenants: {remote: true} };

  render() {
    var tenantNodes = this.props.tenants.map((tenant) => {
      return (
        <li key={tenant.id}>
          {tenant.name} [<a onClick={() => this.props.mutator.tenants.delete(tenant)}>delete</a>]
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
