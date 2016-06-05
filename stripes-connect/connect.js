import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';

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
  const resources = Object.keys(Component.dataQuery); 
  const mapStateToProps = (state) => {
    return resources.reduce((result, resource) => {
      const query = Component.dataQuery[resource];
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
      const query = Component.dataQuery[resource];
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
