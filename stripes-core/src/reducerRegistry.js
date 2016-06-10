import { combineReducers } from 'redux';
import initialReducers from './initialReducers';

let _reducers = initialReducers;
let _triggerUpdate = () => {
  throw new Error('reducerRegistry not initialized');
}; 

export const setUpdateTrigger = cb => _triggerUpdate = cb;
export const getReducer = () => combineReducers({..._reducers});
export const addReducer = (key, reducer) => {
  _reducers[key] = reducer;
  _triggerUpdate();
}
