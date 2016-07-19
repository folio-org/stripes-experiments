import reduxOkapi from 'redux-okapi';

export function mutatorFor(resource, module, dispatch) {
  return { 
    'delete': record => { dispatch(reduxOkapi.actions.delete(resource, record)) },
    'update': record => { dispatch(reduxOkapi.actions.update(resource, record)) },
    'create': record => { dispatch(reduxOkapi.actions.create(resource, record)) }
  };
}

export function reducerFor(resource, module) {
  return reduxOkapi.reducerFor(resource); 
}
