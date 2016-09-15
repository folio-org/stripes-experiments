import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux';
import initialReducers from './initialReducers';

let store;

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(createLogger()),
  )(createStore);

  const reducer = combineReducers(initialReducers);
  const store = finalCreateStore(reducer, initialState);

  return store;
}
