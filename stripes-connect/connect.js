import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
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
  'local': new localResource(),
  'okapi': new restResource({
    pk: 'id',
    clientGeneratePk: true,
    headers : { POST:   { 'Accept': 'application/json',
                          'Content-Type': 'application/json' },
                DELETE: { 'Accept': "text/plain" },
                GET:    { 'Accept': 'application/json',
                          'Content-Type': 'application/json' },
                PUT:    { 'Accept': 'text/plain',
                          'Content-Type': 'application/json' },
                ALL:    { 'X-Okapi-Tenant': 'tenant-id',
                          'Authorization': 'x'}
              }
  }),
  'rest': new restResource()
}

export const connect = (Component, module) => {
  if (!config.addReducer) {
    throw new Error('stripes-connect not configured---please call init() first');
  }
  const addReducer = config.addReducer;
  const manifest = Component.manifest;
  const resources = Object.keys(manifest);

  _.forOwn(manifest, (query, resource) => {
    const type = types[query.type || defaultType];
    addReducer(type.stateKey(resource, module, query),
               type.reducerFor(resource, module, query));
  });

  const mapStateToProps = (state) => {
    return {
      data: resources.reduce((result, resource) => {
        const query = manifest[resource];
        const type = types[query.type || defaultType];
        result[resource] = _.get(state, [type.stateKey(resource, module, query)], null);
        return result;
      }, {})
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      mutator: resources.reduce((result, resource) => {
        const query = manifest[resource];
        const type = types[query.type || defaultType];
        result[resource] = type.mutatorFor(resource, module, dispatch, query);
        return result;
      }, {}),
      refreshRemote: (params) => {
        _.forOwn(manifest, (query, resource) => {
          const type = types[query.type || defaultType];
          if (type.refresh) {
            type.refresh(resource, module, dispatch, query, params);
          }
        });
      }
    };
  }
  let WrappedComponent = Wrapping(Component);
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
  return connectedComponent;
};

