import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { setUpdateTrigger, getReducer } from './reducerRegistry';

let store;

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(createLogger()),
  )(createStore);

  store = finalCreateStore(getReducer(), initialState);
  setUpdateTrigger(function() {
    store.replaceReducer(getReducer()); 
  });

  return store;
}
