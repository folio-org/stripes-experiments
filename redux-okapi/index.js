import fetch from 'isomorphic-fetch';
import crud from 'redux-crud';
// TODO: pass in config externally, perhaps returning curried functions
import { system } from 'stripes-loader!';

const okapiurl = system.okapi.url;
const defaults = {
  pk: 'id',
  prefix: '_/proxy',
  clientGeneratePk: true
};

const actions = {
  update: (endpoint, record, overrides = {}) => {
    const options = Object.assign({}, defaults, overrides);
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, options.prefix, endpoint, record[options.pk]].join('/');
    if (options.suffix) url += options.suffix;
    return function(dispatch) {
      dispatch(crudActions.deleteStart(record));
      return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(record)
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.updateError(response));
          } else {
            dispatch(crudActions.updateSuccess(record));
          }
        });
    }

  },
  delete: (endpoint, record, overrides = {}) => {
    const options = Object.assign({}, defaults, overrides);
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, options.prefix, endpoint, record[options.pk]].join('/');
    if (options.suffix) url += options.suffix;
    return function(dispatch) {
      dispatch(crudActions.deleteStart(record));
      return fetch(url, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.deleteError(response));
          } else {
            console.log("deleting entity ", endpoint, record);
            dispatch(crudActions.deleteSuccess(record));
          }
        });
    }
  },
  fetch: (endpoint, overrides = {}) => {
    const options = Object.assign({}, defaults, overrides);
    // TODO: cache this?
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, options.prefix, endpoint].join('/');
    if (options.suffix) url += options.suffix;
    return function(dispatch) {
      dispatch(crudActions.fetchStart());
      return fetch(url)
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.fetchError(response));
          } else {
            response.json().then(json => {
              dispatch(crudActions.fetchSuccess(json));
            });
          }
        });
    };
  }
};

function reducerFor(endpoint, overrides = {}) {
  const options = Object.assign({}, defaults, overrides);
  const crudReducers = crud.reducersFor(endpoint, {key: options.pk, store: crud.STORE_MUTABLE});
  // extra reducer (beyond redux-crud generated reducers) for clearing a list before populating from new fetch
  return function (state=[], action) {
    switch (action.type) {
      case 'CLEAR_' + endpoint.toUpperCase() :
        return [];
      default:
        return crudReducers(state, action);
    }
  }
}

export default { reducerFor, actions };
