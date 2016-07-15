import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import reduxOkapi from 'redux-okapi';
import * as localstate from './localstate';
import * as okapi from './okapi';
import Wrapping from './ComponentWrapping';


class Wrapper extends React.Component {
  render() {
    return React.createElement(this.props.wrapped);
  }
};


// TODO: This should move to provider or store somehow
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
      addReducer(resource, okapi.reducerFor(resource, module));
    } else {
      addReducer(`${module}-${resource}`, localstate.reducerFor(resource, module));
    }
  });

  const mapStateToProps = (state) => {
    return resources.reduce((result, resource) => {
      const query = manifest[resource];
      if (query.remote) {
        result[resource] = _.get(state, [resource], null);
      } else {
        result[resource] = _.get(state, [`${module}-${resource}`], null);
      }
      return result;
    }, {});
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      mutator: resources.reduce((result, resource) => {
        const query = manifest[resource];
        if (query.remote) {
          result[resource] = okapi.mutatorFor(resource, module, dispatch);
        } else {
          result[resource] = localstate.mutatorFor(resource, module, dispatch);
        }
        return result;
      }, {}),
      refreshRemote: (params) => {
        _.forOwn(manifest, (query, resource) => {
          if (query.remote) { 
            let overrides = {};
            if (query.suffix && query.suffix.startsWith(":")) {
              let suffix = query.suffix.substring(1);
              overrides = { suffix : "/"+params[suffix]};
            }                       
            dispatch(reduxOkapi.actions.fetch(resource,overrides));
          }
        });
      }
    };
  }
  let WrappedComponent = Wrapping(Component);
  const connectedComponent = reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
  return connectedComponent;
};

