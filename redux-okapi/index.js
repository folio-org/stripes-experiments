import fetch from 'isomorphic-fetch';
import crud from 'redux-crud';
import { system } from 'stripes-loader!';

const okapiurl = system.okapi.url;
const apicfg = {
  "tenants": {
    pk: "id",
    clientGeneratePk: true,
    paths: {
      create: () => { return okapiurl + "/_/proxy/tenants"; },
      update: (tenant) => { return okapiurl + "/_/proxy/tenants/" + tenant.id; },
      delete: (tenant) => { return okapiurl + "/_/proxy/tenants/" + tenant.id; },
      fetch: (tenant) => { return okapiurl + "/_/proxy/tenants" + (tenant ? "/" + tenant.id : ''); }
    }
  }
}

// Generate redux-crud actions
for (var resource in apicfg) {
  if (apicfg.hasOwnProperty(resource)) {
    apicfg[resource].actions  = crud.actionCreatorsFor(resource);
  }
}

const actions = {
  fetch: function(entityType, dispatch) {
    let resource = apicfg[entityType];
    let okapiPath = resource.paths.fetch();
    return function(dispatch) {
      dispatch(resource.actions.fetchStart());
      return fetch(okapiPath)
        .then(response => {
            if (response.status >= 400) {
              dispatch(resource.actions.fetchError(response));
            } else {
              response.json().then(json => {
                // if (!entity) {
                //   dispatch({ type: "CLEAR_"+entityType.toUpperCase()});
                // }
                dispatch(resource.actions.fetchSuccess(json));
              });
            }
          })
    }
  }
}

function reducerFor(entityType) {
  const crudReducers = crud.reducersFor(resource, {key: apicfg[resource].pk, store: crud.STORE_MUTABLE});
  // extra reducer (beyond redux-crud generated reducers) for clearing a list before populating from new fetch
  return function (state=[], action) {
    switch (action.type) {
      case 'CLEAR_' + entityType.toUpperCase() :
        return [];
      default:
        return crudReducers(state, action);
    }
  }
}

export default { reducerFor, actions };
