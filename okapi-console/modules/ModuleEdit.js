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
    this.props.mutator['modules'].PUT(data).then(()=>
      this.context.router.push('/okapi-console/modules/list')
    )
  }

  cancel(data) {
    this.context.router.push('/okapi-console/modules/list');
  }

  render() {
    const { data: {modules}, mutator } = this.props;

    let moduleid = this.props.params.moduleid;
    let module = modules.find((module) =>  { return module.id === moduleid });
    if (!module || !module.provides) {
      return <div/>;
    }
    return <ModuleForm initialValues={module} onSubmit={this.update.bind(this)} cancelForm={this.cancel.bind(this)} />
  }
}

export default connect(ModuleEdit, 'okapi-console');

