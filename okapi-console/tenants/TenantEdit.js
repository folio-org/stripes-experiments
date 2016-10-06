import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import TenantForm from './TenantForm';


class TenantEdit extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = { 'tenants': { type: 'okapi',
                                   path: '_/proxy/tenants/:tenantid'
                                 }
                    };

  cancel (data) {
    this.context.router.push('/okapi-console/tenants/list'); 
  }

  update(data) {
    this.props.mutator.tenants.PUT(data).then (() =>
      this.context.router.push('/okapi-console/tenants/list')
      );
  }

  render() {
      const { data: {tenants}, params: {tenantid} } = this.props;

      let tenant = tenants.find((tenant) =>  { return tenant.id === tenantid });

      return <TenantForm onSubmit={this.update.bind(this)}
                         cancelForm={this.cancel.bind(this)}
                         submitLabel='Save'
                         initialValues={tenant} />
  }
}

export default connect(TenantEdit, 'okapi-console');


