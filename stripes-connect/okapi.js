import reduxOkapi from 'redux-okapi';

export function mutatorFor(resource, module, dispatch, overrides) {
  return { 
    'delete': record => { dispatch(reduxOkapi.actions.delete(resource, record, overrides)) },
    'update': record => { dispatch(reduxOkapi.actions.update(resource, record, overrides)) },
    'create': record => { dispatch(reduxOkapi.actions.create(resource, record, overrides)) }
  };
}

export function reducerFor(resource, module, overrides) {
  console.log("okapi reducerFor, overrides", overrides);
  return reduxOkapi.reducerFor(resource, overrides); 
}
