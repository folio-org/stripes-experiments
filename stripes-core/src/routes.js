import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App } from './App';
import { Front } from './Front';

import { routes as moduleRoutes } from 'stripes-loader!';

export default ([
  { path: '/',
    component: App,
    indexRoute: { component: Front },
    childRoutes: [
      ...moduleRoutes
    ]
  }
]);
