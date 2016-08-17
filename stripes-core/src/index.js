import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux'
import { hashHistory } from 'react-router';
import configureStore from './configureStore';
import Root from './Root';

// Stylesheets are stored in webpack/global.css via extract-text-webpack-plugin
import '../styles/global.sass';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
