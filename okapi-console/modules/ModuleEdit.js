import React, { Component, PropTypes } from 'react';
import { connect } from 'stripes-connect';
import ModuleForm from './ModuleForm';
import TestForm from './reduxForm';
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

  sub(data) {
    console.log("submitting data: ", data);
  }

  
  render() {
    let moduleid = this.props.params.moduleid;
    let modules = this.props.data['modules']
    let module = modules.find((module) =>  { return module.id === moduleid });
    console.log("modules: ", modules);
    console.log("moduleid: ", moduleid);
    console.log("module: ", module);
    console.log("module.provides: "+(module.provides ? module.provides.id : "no provides"));
    let obj1 = Object.assign({}, module);
    let obj2 = { id: "module-id", name: "patrons", provides: [{ "id" :"prov-id", "version" : "1.2.3"}] };

    console.log("obj1 ", obj1);
    console.log("obj2 ", obj2);
    return <TestForm initialValues={obj1} onSubmit={this.sub.bind(this)} />
  }
}

/*
    return <TestForm initialValues={obj1} onSubmit={this.sub.bind(this)} />

    return <ModuleForm onSubmit={this.sub.bind(this)} 
                       cancelForm={this.cancel.bind(this)} 
                       submitLabel='Save'
                       initialValues={module} />
*/

export default connect(ModuleEdit, 'okapi-console');

