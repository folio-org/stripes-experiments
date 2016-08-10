import fetch from 'isomorphic-fetch';
import crud from 'redux-crud';
import _ from 'lodash';
import uuid from 'node-uuid';

const defaultDefaults = { pk: 'id', clientGeneratePk: true };

export default class restResource { 

  constructor(name, query = {}, module = null, defaults = defaultDefaults)  {
    this.name = name;
    this.module = module;
    this.crudName = module ? `${module}_${name}` : name;
    // TODO: actual substitution of params/state
    this.optionsTemplate = _.merge({}, defaults, query);
    this.options = null;
    this.crudActions = crud.actionCreatorsFor(this.crudName);
    this.crudReducers = crud.reducersFor(this.crudName,
      { key: this.optionsTemplate.pk, store: crud.STORE_MUTABLE });
    // Javascript methods are not bound to their instance by default
    this.reducer = this.reducer.bind(this);
  }

  getMutator(dispatch) {
    return { 
      'delete': record => { dispatch(this.deleteAction(record)) },
      'update': record => { dispatch(this.updateAction(record)) },
      'create': record => { dispatch(this.createAction(record)) }
    };
  }

  reducer(state = [], action) {
    switch (action.type) {
      // extra reducer (beyond redux-crud generated reducers) for clearing a list before populating from new fetch
      case 'CLEAR_' + this.crudName.toUpperCase() :
        return [];
      default:
        return this.crudReducers(state, action);
    }
  }
  
  stateKey() {
    return this.crudName;
  }

  refresh(dispatch, params) {
    // shallow copy; we'll need to go deeper once templating params
    this.options = {...this.optionsTemplate};
    // TODO: still not really implemented
    if (this.path && this.path.startsWith(":")) {
      let path = this.options.path.substring(1);
      this.options.path = "/" + params[path];
    }
    dispatch(this.fetchAction());
  }

  createAction(record) {
    const { root, endpoint, pk, clientGeneratePk, headers } = this.options;
    const crudActions = this.crudActions;
    const url = [ root, endpoint || this.name ].join('/');
    return function(dispatch) {
      // Optimistic record creation ('clientRecord')
      const cuuid = uuid();
      let clientRecord = { ...record };
      clientRecord[pk] = cuuid;
      dispatch(crudActions.createStart(clientRecord));
      if (clientGeneratePk) {
        record[pk] = cuuid;
      }
      // Send remote record ('record')
      return fetch(url, {
        method: 'POST',
        headers: Object.assign({}, headers.ALL, headers.POST),
        body: JSON.stringify(record)
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.createError(response, clientRecord));
          } else {
            response.json().then ( (json) => {
              if (json[options.pk] && !json.id) json.id = json[options.pk];
              dispatch(crudActions.createSuccess(json, cuuid));
            });
          }
        });
    }
  }

  updateAction(record) {
    const { root, endpoint, pk, clientGeneratePk, headers } = this.options;
    const crudActions = this.crudActions;
    const url = [ root, endpoint || this.name, record[pk] ].join('/');
    let clientRecord = record;
    if (clientRecord[pk] && !clientRecord.id) clientRecord.id = clientRecord[options.pk];
    return function(dispatch) {
      dispatch(crudActions.updateStart(clientRecord));
      return fetch(url, {
        method: 'PUT',
        headers: Object.assign({}, headers.ALL, headers.PUT),
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

  deleteAction(record) {
    const { root, endpoint, pk, clientGeneratePk, headers } = this.options;
    const crudActions = this.crudActions;
    const url = [ root, endpoint || this.name, record[pk] ].join('/');
    return function(dispatch) {
      if (record[pk] && !record.id) record.id = record[pk];
      dispatch(crudActions.deleteStart(record));
      return fetch(url, {
        method: 'DELETE',
        headers: Object.assign({}, headers.ALL, headers.DELETE)
      })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.deleteError(response, record));
          } else {
            dispatch(crudActions.deleteSuccess(record));
          }
        });
    }
  } 


  fetchAction() {
    const { root, endpoint, path, pk, headers, records } = this.options;
    const crudActions = this.crudActions;
    // ie. only join truthy elements
    const url = [ root, endpoint || this.name, path ].filter(_.identity).join('/');
    return function(dispatch) {
      dispatch(crudActions.fetchStart());
      return fetch(url, { headers: Object.assign({}, headers.ALL, headers.GET) })
        .then(response => {
          if (response.status >= 400) {
            dispatch(crudActions.fetchError(response));
          } else {
            response.json().then(json => {
              let data = (records ? json[records] : json);
              dispatch(crudActions.fetchSuccess(data));
            });
          }
        });
    };
  }
  
}
