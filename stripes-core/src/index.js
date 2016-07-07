import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux'
import { hashHistory } from 'react-router';
import configureStore from './configureStore';
import { addReducer } from './reducerRegistry';
import { init as initConnect } from 'stripes-connect';
import Root from './Root';

// Stylesheets are stored in webpack/global.css via extract-text-webpack-plugin
import '../styles/global.sass';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// TODO: expose the reducer registry on the store/provider
initConnect({ addReducer });

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
