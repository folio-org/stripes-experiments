import React from 'react';
import _ from 'lodash';
import reduxOkapi from 'redux-okapi';
import * as localstate from './localstate';
import * as okapi from './okapi';
import { reducer as formReducer, reduxForm } from 'redux-form';
import Wrapping from './ComponentWrapping';


// TODO: This should move to provider or store somehow
//
// Current keys:
//   addReducer(<state key>, <reducer function>)
let config = {};
export const init = newConfig => {
  Object.assign(config, newConfig);
  config.addReducer('form', formReducer);
}

export const connectForm = (Component, module) => {
  // if (!config.addReducer) {
  //   throw new Error('stripes-connect not configured---please call init() first');
  // }
  // const addReducer = config.addReducer;
  // const manifest = Component.manifest;
  // const resources = Object.keys(manifest);

  // _.forOwn(manifest, (query, resource) => {
  //   if (query.remote) {
  //     addReducer(resource, okapi.reducerFor(resource, module));
  //   } else {
  //     addReducer(`${module}-${resource}`, localstate.reducerFor(resource, module));
  //   }
  // });

  const formComponent = reduxForm({
    form: 'testing'
  })(Component);
  return formComponent;
};

