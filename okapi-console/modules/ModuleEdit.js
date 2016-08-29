import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import ModuleForm from './ModuleForm';
import { removeEmpty } from '../utils/removeEmptyObjectsFromArrays';


class ModuleEdit extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static manifest = { 'modules': { type: 'okapi',
                                   path: '_/proxy/modules/:moduleid'
                                 }
                    };

  update(data) {
    removeEmpty(data);
    this.props.mutator['modules'].update(data);
    this.context.router.push('/okapi-console/modules/list');
  }

  cancel(data) {
    this.context.router.push('/okapi-console/modules/list');
  }

  render() {
    let moduleid = this.props.params.moduleid;
    let modules = this.props.data['modules']
    let module = modules.find((module) =>  { return module.id === moduleid });
    if (!module || !module.provides) {
      return <div/>;
    }
    return <ModuleForm initialValues={module} onSubmit={this.update.bind(this)} cancelForm={this.cancel.bind(this)} />
  }
}

export default connect(ModuleEdit, 'okapi-console');

