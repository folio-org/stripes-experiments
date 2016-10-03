import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';

const ComponentToTest = require(COMPONENT_TO_TEST).default;

let reducers = { form: formReducer };
const finalCreateStore = compose(
  applyMiddleware(thunk),
  applyMiddleware(createLogger()),
)(createStore);
const store = finalCreateStore(combineReducers({...reducers}));


class Root extends Component {
  addReducer = (key, reducer) => {
    if (reducers[key] === undefined) {
      reducers[key] = reducer;
      this.props.store.replaceReducer(combineReducers({...reducers}));
      return true;
    } else return false;
  }

  getChildContext() {
    return {addReducer: this.addReducer.bind(this)};
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <ComponentToTest/>
      </Provider>
    );
  }
}

Root.childContextTypes = {
  addReducer: PropTypes.func
};

render(
  <Root store={store} />,
  document.getElementById('root')
);
