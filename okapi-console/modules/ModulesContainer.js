import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import okapicrud from '../okapi/okapicrud.js';

class ModulesContainer extends Component {
  static contextTypes = {
    router: PropTypes.func.isRequired
  };

  constructor(){
    super(...arguments);
  }

  componentDidMount() {    
    this.props.dispatch(okapicrud.fetch('modules'));
    this.props.dispatch(okapicrud.fetch('discovery_nodes'));
  }

  componentWillReceiveProps(nextProps){
    // If module ID changed 
    let entity = { id: nextProps.params.id };
    if (nextProps.params.id && nextProps.params.id != this.props.params.id) {
      this.props.dispatch(        
        okapicrud.fetch('modules',entity)
        );
    }
  }

  updateModule(data, dispatch, e) {
    removeEmptyObjectsFromArrays(data);
    let promise = dispatch(okapicrud.update('modules',data));
    //promise.then(() => this.context.router.push('/modules/list')); 
  }

  addModule (data, dispatch, e) {
    removeEmptyObjectsFromArrays(data);
    let promise = dispatch(okapicrud.create('modules',data));
    promise.then(() => this.context.router.push('/modules/edit/'+data.id)); 
  }

  deleteModule (data, dispatch, e) {
    let promise = dispatch(okapicrud.delete('modules',data));
    promise.then(() => this.context.router.push('/modules/list')); 
  }

  cancel (amodule, dispatch, e) {
    this.context.router.push('/modules/list'); 
  }

  // Passes data and callbacks to child components (see children in Modules.js)
  render() {    
  	let modules = this.props.children && 
  	              React.cloneElement(this.props.children,
  	              { modules: this.props.modules, // list modules
                    discoveryNodes : this.props.discoveryNodes,
                    amodule: this.props.modules.find((el) => el.id == this.props.params.id),                   
  	                updateModule: this.updateModule.bind(this), // edit module
  	                addModule: this.addModule.bind(this), // create module
  	                deleteModule: this.deleteModule.bind(this), // delete module
  	                cancel: this.cancel.bind(this)}); // create, edit, delete module
    return modules;
  }
}

const removeEmptyObjectsFromArrays = (data) => {
  for (var entry in data) {
    if (Object.prototype.toString.call(data[entry]) === '[object Array]') {
      if (data[entry].length) {
        var i = data[entry].length;
        while (i--) {
          if (Object.prototype.toString.call(data[entry][i]) === '[object Null]') {
            data[entry].splice(i,1);
          } else if (isEmptyObject(data[entry][i])) {
            data[entry].splice(i,1);
          } else if (Object.prototype.toString.call(data[entry][i]) === '[object Object]') {
             removeEmptyObjectsFromArrays(data[entry][i]);
          }
        }
      }
    } else if (Object.prototype.toString.call(data[entry]) === '[object Object]') {
      removeEmptyObjectsFromArrays(data[entry]);
    }
  }
}

const isEmptyObject = (obj) => {
  for (var prop in obj)
    if (Object.prototype.toString.call(obj[prop]) !== '[object Undefined]')
      if (obj[prop] && obj[prop].length > 0) return false;
  return true;
}

const mapStateToProps = (state) => { 
  return { modules: state.modules, 
           discoveryNodes: state.discovery_nodes }
};

export default connect(mapStateToProps)(ModulesContainer);
