import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import ModuleForm from './ModuleForm';

class ModuleAdd extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = { '_/proxy/modules': { type: 'okapi'
                                         }
                    };

  create(data) {
    this.props.mutator['_/proxy/modules'].create(data);
    this.context.router.push('/okapi-console/modules/list');
  }

  cancel(data) {
    this.context.router.push('/okapi-console/modules/list');
  }



  render() {
    return (
        <ModuleForm onSubmit={this.create.bind(this)} 
                    cancelForm={this.cancel.bind(this)} 
                    submitLabel='Add' />
    );
  }
}

export default connect(ModuleAdd, 'okapi-console');
