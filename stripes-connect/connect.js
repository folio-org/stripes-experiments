import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import okapiResource from './okapiResource';
import restResource from './restResource';
import localResource from './localResource';
import Wrapping from './ComponentWrapping';


// TODO: This config/init should move to provider or store somehow
//
// Current keys:
//   addReducer(<state key>, <reducer function>)
let config = {};
export const init = newConfig => Object.assign(config, newConfig);

const defaultType = 'local';
const types = {
  'local': localResource,
  'okapi': okapiResource,
  'rest': restResource
}

export const connect = (Component, module) => {
  if (!config.addReducer) {
    throw new Error('stripes-connect not configured---please call init() first');
  }
  const addReducer = config.addReducer;
  const manifest = Component.manifest;
  let resources = [];

  _.forOwn(manifest, (query, name) => {
    const resource = new types[query.type || defaultType](name, query, module);
    addReducer(resource.stateKey(), resource.reducer);
    resources.push(resource);
  });

  const mapStateToProps = (state) => {
    return {
      data: resources.reduce((result, resource) => {
        result[resource.name] = _.get(state, [resource.stateKey()], null);
        return result;
      }, {})
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      mutator: resources.reduce((result, resource) => {
        result[resource.name] = resource.getMutator(dispatch);
        return result;
      }, {}),
      refreshRemote: (params) => {
        resources.forEach(resource => {
          if (resource.refresh) {
            resource.refresh(dispatch, params);
          }
        });
      }
    };
  }
  let WrappedComponent = Wrapping(Component);
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
  return connectedComponent;
};

