import React, { Component, PropTypes } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import initialReducers from './initialReducers';

let reducers = {...initialReducers};

export default class Root extends Component {

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
        <div>
          <Router history={this.props.history} routes={routes} />
        </div>
      </Provider>
    );
  }

}

Root.childContextTypes = {
  addReducer: PropTypes.func
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
