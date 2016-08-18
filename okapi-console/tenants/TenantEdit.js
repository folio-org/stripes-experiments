import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import TenantForm from './TenantForm';

class TenantEdit extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = { '_/proxy/tenants': { type: 'okapi',
                                           path: ':tenantid'
                                         }
                    };

  cancel (data, dispatch, e) {
    this.context.router.push('/okapi-console/tenants/list'); 
  }

  update(data) {
    this.props.mutator['_/proxy/tenants'].update(data);
    this.context.router.push('/okapi-console/tenants/list');
  }

  render() {
      let tenantid = this.props.params.tenantid;
      let tenants = this.props.data['_/proxy/tenants']
      let tenant = tenants.find((tenant) =>  { return tenant.id === tenantid });

      return <TenantForm onSubmit={this.update.bind(this)}
                         cancelForm={this.cancel.bind(this)}
                         submitLabel='Save'
                         initialValues={tenant} />
  }
}

export default connect(TenantEdit, 'okapi-console');


