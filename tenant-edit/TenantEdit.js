import React, { Component } from 'react';
import { connect } from 'stripes-connect';

export default class TenantEdit extends Component {
  static manifest = { tenants: {remote: true} };

  render() { 
      return <div>Tenant Edit ID: {this.props.params.id}</div>
  }
}

export default connect(TenantEdit, 'tenant-edit');
