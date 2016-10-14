import React, { Component, PropTypes } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import Router from 'react-router/HashRouter';
import Match from 'react-router/Match';

import { Front } from './Front';
import { Menu } from './Menu';
import moduleRoutes from './moduleRoutes';
import initialReducers from './initialReducers';

const reducers = { ...initialReducers };

export default class Root extends Component {

  getChildContext() {
    return { addReducer: this.addReducer.bind(this) };
  }

  addReducer = (key, reducer) => {
    if (reducers[key] === undefined) {
      reducers[key] = reducer;
      this.props.store.replaceReducer(combineReducers({ ...reducers }));
      return true;
    }
    return false;
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}><Router>
        <Grid>
          <Row><Menu /></Row>
          <Row>
            <Col id="content">
              <Match pattern="/" exactly component={Front} key="root" />
              {moduleRoutes}
            </Col>
          </Row>
        </Grid>
      </Router></Provider>
    );
  }

}

Root.childContextTypes = {
  addReducer: PropTypes.func,
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};
