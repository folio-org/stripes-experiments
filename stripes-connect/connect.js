import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import { addReducer } from 'stripes-core/src/reducerRegistry';
import * as localstate from './localstate';

export const connect = (Component, module) => {
  const resources = Object.keys(Component.manifest); 

  resources.map((resource) => {
    const query = Component.manifest[resource];
    if (query.remote) {
    } else {
      addReducer(`${module}-${resource}`, localstate.getReducer(resource, module));
    }
  });

  const mapStateToProps = (state) => {
    return resources.reduce((result, resource) => {
      const query = Component.manifest[resource];
      if (query.remote) {
        result[resource] = _.get(state.okapi, [resource], null);
      } else {
        result[resource] = _.get(state, [`${module}-${resource}`], null);
      }
      return result;
    }, {});
  }

  const mapDispatchToProps = (dispatch) => {
    return { mutator: resources.reduce((result, resource) => {
      const query = Component.manifest[resource];
      if (query.remote) {
        result[resource] = getMutatorFor(resource, module, 'okapi', dispatch);
      } else {
        result[resource] = localstate.getMutator(resource, module, dispatch);
      }
      return result;
    }, {}) };
  }
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(Component);
  return connectedComponent;
};
