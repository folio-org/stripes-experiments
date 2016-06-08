import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import crud from 'redux-crud'
import { combineReducers } from 'redux';

// TODO reducer registry in core via store.replaceReducer() and handle
// module state with a reducer instance for each module/key
const moduleStateReducer = (state = {}, action) => {
  if (!(action.type.startsWith('MODULESTATE_'))) return state;
  const newState = Object.assign({}, state);
  const module = action.meta.module;
  const key = action.meta.key;
  switch (action.type) {
    case 'MODULESTATE_UPDATE': 
      if (!(module in newState)) newState[module] = {};
      if (!(key in newState[module])) newState[module][key] = {};
      newState[module][key] = Object.assign({}, newState[module], action.payload);
      break;
    case 'MODULESTATE_REPLACE': 
      if (!(module in newState)) newState[module] = {};
      newState[module][key] = Object.assign({}, action.payload);
      break;
  };
  return newState;
};

const rootReducer = combineReducers({
  modules: moduleStateReducer,
  routing,
  form
});

export default rootReducer;
