export default class localResource { 

  mutatorFor(resource, module, dispatch, query) {
    return { 
      'update': function(newData) {
        return dispatch({
          type: 'STRIPESLOCALSTATE_UPDATE',
          payload: newData,
          meta: {
            module: module,
            resource: resource
          }
        });
      },  
      'replace': function(newData) {
        return dispatch({
          type: 'STRIPESLOCALSTATE_REPLACE',
          payload: newData,
          meta: {
            module: module,
            resource: resource
          }
        });
      }  
    };
  }

  stateKey(resource, module, query) {
    return `${module}-${resource}`;
  }

  reducerFor(resource, module, query) {
    return (state = {}, action) => {
      if (!(action.type.startsWith('STRIPESLOCALSTATE_'))) return state;
      if (!(action.meta.module && action.meta.resource)) return state; 
      const actionKey = `${action.meta.module}-${action.meta.resource}`;
      if (!(actionKey === `${module}-${resource}`)) return state;
      switch (action.type) {
        case 'STRIPESLOCALSTATE_UPDATE': 
          return Object.assign({}, state, action.payload);
        case 'STRIPESLOCALSTATE_REPLACE': 
          return action.payload;
      };
      return newState;
   }
  }
  
}

