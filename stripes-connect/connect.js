import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import { addReducer } from 'stripes-core/src/reducerRegistry';

addReducer('modules', (state = {}, action) => {
  if (!(action.type.startsWith('MODULESTATE_'))) return state;
  const newState = Object.assign({}, state);
  const module = action.meta.module;
  const key = action.meta.key;
  switch (action.type) {
    case 'MODULESTATE_UPDATE': 
      if (!(module in newState)) newState[module] = {};
      if (!(key in newState[module])) newState[module][key] = {};
      newState[module][key] = Object.assign({}, newState[module], action.payload);
      break;
    case 'MODULESTATE_REPLACE': 
      if (!(module in newState)) newState[module] = {};
      newState[module][key] = Object.assign({}, action.payload);
      break;
  };
  return newState;
});


function getMutatorFor(resource, module, type, dispatch) {
  switch (type) {
    case 'okapi':
      break;
    case 'local':
      return { 
        'update': function(newData) {
          return dispatch({
            type: 'MODULESTATE_UPDATE',
            payload: newData,
            meta: {
              module: module,
              key: resource
            }
          });
        },  
        'replace': function(newData) {
          return dispatch({
            type: 'MODULESTATE_REPLACE',
            payload: newData,
            meta: {
              module: module,
              key: resource
            }
          });
        }  
      };
      break;
  };
}

export const connect = (Component, module) => {
  const resources = Object.keys(Component.manifest); 
  console.log(Component.store);
  const mapStateToProps = (state) => {
    return resources.reduce((result, resource) => {
      const query = Component.manifest[resource];
      if (query.remote === true) {
        result[resource] = _.get(state.okapi, [resource], null);
      } else {
        result[resource] = _.get(state.modules, [module, resource], null);
      }
      return result;
    }, {});
  }
  const mapDispatchToProps = (dispatch) => {
    return { mutator: resources.reduce((result, resource) => {
      const query = Component.manifest[resource];
      if (query.remote === true) {
        result[resource] = getMutatorFor(resource, module, 'okapi', dispatch);
      } else {
        result[resource] = getMutatorFor(resource, module, 'local', dispatch);
      }
      return result;
    }, {}) };
  }
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(Component);
  return connectedComponent;
};
