import reduxOkapi from 'redux-okapi';

export function mutatorFor(resource, module, dispatch) {
  return { 
    'update': (resource, data) => reduxOkapi.actions.update(resource, data)
  };
}

export function reducerFor(resource, module) {
  return reduxOkapi.reducerFor(resource); 
}
