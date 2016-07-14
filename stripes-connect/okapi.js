import reduxOkapi from 'redux-okapi';

export function mutatorFor(resource, module, dispatch) {
  return { 
    'delete': record => { dispatch(reduxOkapi.actions.delete(resource, record)) }
  };
}

export function reducerFor(resource, module) {
  return reduxOkapi.reducerFor(resource); 
}
