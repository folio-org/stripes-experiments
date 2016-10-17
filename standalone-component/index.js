import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import Router from 'react-router/HashRouter';
import Match from 'react-router/Match';

const ComponentToTest = require(COMPONENT_TO_TEST).default;

const reducers = { form: formReducer };
const finalCreateStore = compose(
  applyMiddleware(thunk),
  applyMiddleware(createLogger()),
)(createStore);
const store = finalCreateStore(combineReducers({ ...reducers }));

class Root extends Component {
  addReducer = (key, reducer) => {
    if (reducers[key] === undefined) {
      reducers[key] = reducer;
      this.props.store.replaceReducer(combineReducers({ ...reducers }));
      return true;
    }
    return false;
  }

  getChildContext() {
    return { addReducer: this.addReducer.bind(this) };
  }

  render() {
    return (
      <Provider store={this.props.store}><Router>
        <Match pattern="/" component={ComponentToTest} />
      </Router></Provider>
    );
  }
}

Root.childContextTypes = {
  addReducer: PropTypes.func,
};

render(
  <Root store={store} />,
  document.getElementById('root')
);
