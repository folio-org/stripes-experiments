import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import ModuleForm from './ModuleForm';
import { removeEmpty } from '../utils/removeEmptyObjectsFromArrays';

class ModuleAdd extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = { 'modules' : { type: 'okapi',
                                    path: '_/proxy/modules',
                                    fetch: false
                                  }
                    };

  create(data) {
    removeEmpty(data);
    this.props.mutator['modules'].POST(data).then(() =>
      this.context.router.push('/okapi-console/modules/list')
    );
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
