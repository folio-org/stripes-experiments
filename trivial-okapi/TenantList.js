import React, { Component } from 'react';
import { connect } from 'stripes-connect';
class TenantList extends Component {
  static manifest = { tenants: {remote: true} };
  componentWillMount() {
    this.props.refreshRemote();
  }
  render() {
    var tenantNodes = this.props.tenants.map(function (tenant) {
      return (
        <li key={tenant.id}>
          {tenant.name}
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
