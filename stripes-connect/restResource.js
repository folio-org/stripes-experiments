import fetch from 'isomorphic-fetch';
import crud from 'redux-crud';
// TODO: pass in config externally, perhaps returning curried functions
import { system } from 'stripes-loader!';
import uuid from 'node-uuid';

const okapiurl = system.okapi.url;

export default class restResource { 

  constructor(defaults) {
    if (defaults) this.defaults = defaults;
    else this.defaults = { pk: 'id', clientGeneratePk: true };
  }

  mutatorFor(resource, module, dispatch, query) {
    return { 
      'delete': record => { dispatch(this.delete(resource, record, query)) },
      'update': record => { dispatch(this.update(resource, record, query)) },
      'create': record => { dispatch(this.create(resource, record, query)) }
    };
  }

  reducerFor(resource, module, query) {
    const options = Object.assign({}, this.defaults, query);
    const crudReducers = crud.reducersFor(resource, {key: options.pk, store: crud.STORE_MUTABLE});
    // extra reducer (beyond redux-crud generated reducers) for clearing a list before populating from new fetch
    return function (state=[], action) {
      switch (action.type) {
        case 'CLEAR_' + resource.toUpperCase() :
          return [];
        default:
          return crudReducers(state, action);
      }
    }
  }
  
  stateKey(resource, module, query) {
    return this.fetchURL(resource, query);
  }

  refresh(resource, module, dispatch, query, params) {
    let fetchQuery = {...query};
    if (query.path && query.path.startsWith(":")) {
      let path = query.path.substring(1);
      fetchQuery.path = "/" + params[path];
    }
    dispatch(this.fetch(resource, fetchQuery));
  }

  create(endpoint, record, overrides = {}) {
    const defaults = this.defaults;
    // deep override of headers
    overrides.headers = Object.assign(defaults.headers.ALL, defaults.headers.POST, overrides.headers);
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
  }

  update(endpoint, record, overrides = {}) {
    const defaults = this.defaults;
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.ALL, defaults.headers.PUT, overrides.headers);
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
  }

  delete(endpoint, record, overrides = {}) {
    const defaults = this.defaults;
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.ALL, defaults.headers.DELETE, overrides.headers);
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
  } 

  fetchURL(resource, query = {}) {
    const options = Object.assign({}, this.defaults, query);
    let url = [okapiurl, resource].join('/');
    if (options.path) url += options.path;
    return url;
  }

  fetch(endpoint, overrides = {}) {
    const defaults = this.defaults;
    // deep override of headers 
    overrides.headers = Object.assign(defaults.headers.ALL, defaults.headers.GET, overrides.headers);
    // top-level overrides of any other default properties
    const options = Object.assign({}, defaults, overrides);
    const url = this.fetchURL(endpoint, overrides);
    // TODO: cache this?
    const crudActions = crud.actionCreatorsFor(endpoint)
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
  
}
