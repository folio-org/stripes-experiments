import restResource from './restResource';
// TODO: pass in config externally, perhaps returning curried functions
// ...the OKAPI_URL via webpack.DefinePlugin is an interim measure to enable
// standalone components.
let system;
if (OKAPI_URL) {
  system = {okapi: { 'url':'http://localhost:9130' }}
} else {
  system = require('stripes-loader!').system;
}

const defaults = {
  root: system.okapi.url,
  pk: 'id',
  clientGeneratePk: true,
  fetch: true,
  clear: true,
  headers : { POST:   { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
              DELETE: { 'Accept': "text/plain" },
              GET:    { 'Accept': 'application/json',
                        'Content-Type': 'application/json' },
              PUT:    { 'Accept': 'text/plain',
                        'Content-Type': 'application/json' },
              ALL:    { 'X-Okapi-Tenant': 'tenant-id',
                        'Authorization': 'x'}
            }
}

export default class okapiResource extends restResource {

  constructor(name, query = {}, module = null) { 
    super(name, query, module, defaults);
  }

}
