import fetch from 'isomorphic-fetch';
import crud from 'redux-crud';
// TODO: pass in config externally, perhaps returning curried functions
import { system } from 'stripes-loader!';
import uuid from 'node-uuid';

const okapiurl = system.okapi.url;
const defaults = {
  pk: 'id',
  clientGeneratePk: true,
  headers : { POST:   { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
              DELETE: { 'Accept': "text/plain" },
              GET:    { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
              PUT:    { 'Accept': 'text/plain',
                        'Content-Type': 'application/json' },
              ALL:    { 'X-Okapi-Tenant': 'tenant-id'}
            }
};

const actions = {
  create: (endpoint, record, overrides = {}) => {
    // deep override of headers
    overrides.headers = Object.assign(defaults.headers.POST, defaults.headers.ALL, overrides.headers);
    const options = Object.assign({}, defaults, overrides);
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, endpoint].join('/');
    if (options.path) url += options.path;
    return function(dispatch) {
      // Optimistic record creation ('clientRecord')
      let cuuid = uuid();
      let clientRecord = {...record, id: cuuid};
      clientRecord[options.pk] = cuuid;
      dispatch(crudActions.createStart(clientRecord));
      if (options.clientGeneratePk) {
        record[options.pk] = cuuid;
      }
      // Send remote record ('record')
      return fetch(url, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify(record)
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.createError(response,clientRecord));
          } else {
            response.json().then ( (json) => {
              if (json[options.pk] && !json.id) json.id = json[options.pk];
              dispatch(crudActions.createSuccess(json,cuuid));
            });
          }
        });
    }
  },
  update: (endpoint, record, overrides = {}) => {
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.PUT, defaults.headers.ALL, overrides.headers);
    const options = Object.assign({}, defaults, overrides);
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, endpoint, record[options.pk]].join('/');
    //if (options.path) url += options.path;
    let clientRecord = record;
    if (clientRecord[options.pk] && !clientRecord.id) clientRecord.id = clientRecord[options.pk];
    return function(dispatch) {
      dispatch(crudActions.updateStart(clientRecord));
      return fetch(url, {
        method: 'PUT',
        headers: options.headers,
        body: JSON.stringify(record)
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.updateError(response,record));
          } else {
            /* Patrons api will not return JSON
            response.json().then ( (json) => {
              if (json[options.pk] && !json.id) json.id = json[options.pk];
              dispatch(crudActions.updateSuccess(json));
            });
            */
            dispatch(crudActions.updateSuccess(clientRecord));
          }
        });
    }
  },
  delete: (endpoint, record, overrides = {}) => {
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.DELETE, defaults.headers.ALL, overrides.headers);
    const options = Object.assign({}, defaults, overrides);
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, endpoint, record[options.pk]].join('/');
    if (options.path) url += options.path;
    return function(dispatch) {
      if (record[options.pk] && !record.id) record.id = record[options.pk];
      dispatch(crudActions.deleteStart(record));
      return fetch(url, {
        method: 'DELETE',
        headers: options.headers
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.deleteError(response,record));
          } else {
            dispatch(crudActions.deleteSuccess(record));
          }
        });
    }
  },
  fetch: (endpoint, overrides = {}) => {
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.GET, defaults.headers.ALL, overrides.headers);
    // top-level overrides of any other default properties
    const options = Object.assign({}, defaults, overrides);
    // TODO: cache this?
    const crudActions = crud.actionCreatorsFor(endpoint)
    let url = [okapiurl, endpoint].join('/');
    if (options.path) url += options.path;
    return function(dispatch) {
      dispatch(crudActions.fetchStart());
      return fetch(url,
                   {headers: options.headers})
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.fetchError(response));
          } else {
            response.json().then(json => {
              let data = (options.records ? json[options.records] : json);
              dispatch(crudActions.fetchSuccess(data));
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
