import React, { Component } from 'react';
import { connect } from 'stripes-connect';

export default class TenantEdit extends Component {
  static manifest = { tenants: {remote: true, suffix: ":tenantid"} };

  render() { 
      return <div>Tenant Edit ID: {this.props.params.tenantid}</div>
  }
}

export default connect(TenantEdit, 'trivial-okapi');
