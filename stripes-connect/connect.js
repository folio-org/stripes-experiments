import React from 'react';
import _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import okapiResource from './okapiResource';
import restResource from './restResource';
import localResource from './localResource';

const defaultType = 'local';
const types = {
  'local': localResource,
  'okapi': okapiResource,
  'rest': restResource
}

const wrap = (Wrapped, module) => {
  let resources = [];
  _.forOwn(Wrapped.manifest, (query, name) => {
    const resource = new types[query.type || defaultType](name, query, module);
    resources.push(resource);
  });
  class Wrapper extends React.Component {
    constructor(props, context) {
      super();
      if (!(context.addReducer)) {
        throw new Error("No addReducer function available in component context");
      }
      resources.forEach(resource => {
        context.addReducer(resource.stateKey(), resource.reducer);
      });
    }

    componentDidMount() {
      this.props.refreshRemote({...this.props});
    }

    render () {
      return (
        <Wrapped {...this.props} />
      );
    }

  };

  Wrapper.contextTypes = {
    addReducer: React.PropTypes.func
  };

  Wrapper.mapState = function(state) {
    return {
      data: resources.reduce((result, resource) => {
        result[resource.name] = _.get(state, [resource.stateKey()], null);
        return result;
      }, {})
    };
  }

  Wrapper.mapDispatch = function(dispatch) {
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

  return Wrapper;
}

export const connect = (Component, module) => {
  const Wrapper = wrap(Component, module);
  const Connected = reduxConnect(Wrapper.mapState, Wrapper.mapDispatch)(Wrapper);
  return Connected;
};

