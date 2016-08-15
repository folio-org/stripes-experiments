export default class localResource { 

  constructor(name, query = {}, module = null)  {
    this.name = name;
    this.module = module;
    this.reducer = this.reducer.bind(this);
  }

  getMutator(dispatch) {
    const { name, module } = this;
    return { 
      'update': function(newData) {
        return dispatch({
          type: 'STRIPESLOCALSTATE_UPDATE',
          payload: newData,
          meta: {
            module: module,
            resource: name
          }
        });
      },  
      'replace': function(newData) {
        return dispatch({
          type: 'STRIPESLOCALSTATE_REPLACE',
          payload: newData,
          meta: {
            module: module,
            resource: name
          }
        });
      }  
    };
  }

  stateKey() {
    return `${this.module}-${this.name}`;
  }

  reducer(state = {}, action) {
    if (!(action.type.startsWith('STRIPESLOCALSTATE_'))) return state;
    if (!(action.meta.module && action.meta.resource)) return state; 
    const actionKey = `${action.meta.module}-${action.meta.resource}`;
    if (!(actionKey === this.stateKey())) return state;
    switch (action.type) {
      case 'STRIPESLOCALSTATE_UPDATE': 
        return Object.assign({}, state, action.payload);
      case 'STRIPESLOCALSTATE_REPLACE': 
        return action.payload;
    };
    return newState;
 }
  
}

