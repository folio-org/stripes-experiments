import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import reduxOkapi from 'redux-okapi';
import * as localstate from './localstate';
import * as okapi from './okapi';
import Wrapping from './ComponentWrapping';


// TODO: This config/init should move to provider or store somehow
//
// Current keys:
//   addReducer(<state key>, <reducer function>)
let config = {};
export const init = newConfig => Object.assign(config, newConfig);

export const connect = (Component, module) => {
  if (!config.addReducer) {
    throw new Error('stripes-connect not configured---please call init() first');
  }
  const addReducer = config.addReducer;
  const manifest = Component.manifest;
  const resources = Object.keys(manifest);

  _.forOwn(manifest, (query, resource) => {
    
    if (query.remote) {
      addReducer(resource, okapi.reducerFor(resource, module, query.overrides));
    } else {
      addReducer(`${module}-${resource}`, localstate.reducerFor(resource, module));
    }
  });

  const mapStateToProps = (state) => {
    return {
      data: resources.reduce((result, resource) => {
        const query = manifest[resource];
        if (query.remote) {
          result[resource] = _.get(state, [resource], null);
        } else {
          result[resource] = _.get(state, [`${module}-${resource}`], null);
        }
        return result;
      }, {})
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      mutator: resources.reduce((result, resource) => {
        const query = manifest[resource];
        if (query.remote) {
          result[resource] = okapi.mutatorFor(resource, module, dispatch, query.overrides);
        } else {
          result[resource] = localstate.mutatorFor(resource, module, dispatch);
        }
        return result;
      }, {}),
      refreshRemote: (params) => {
        _.forOwn(manifest, (query, resource) => {
          if (query.remote) { 
            let overrides = {...query.overrides};
            if (query.path && query.path.startsWith(":")) {
              let path = query.path.substring(1);
              overrides.path = "/" + params[path];
            }
            dispatch(reduxOkapi.actions.fetch(resource, overrides));
          }
        });
      }
    };
  }
  let WrappedComponent = Wrapping(Component);
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
  return connectedComponent;
};

