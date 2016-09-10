import React, { Component } from 'react';
import { connect } from 'stripes-connect';

class TenantEdit extends Component {
  static manifest = { '_proxy/tenants': {type: 'okapi', path: ':tenantid'} };

  render() { 
      return <div>Tenant Edit ID: {this.props.params.tenantid}</div>
  }
}

export default connect(TenantEdit, 'trivial-okapi');
