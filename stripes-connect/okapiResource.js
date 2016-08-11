import restResource from './restResource';
// TODO: pass in config externally, perhaps returning curried functions
import { system } from 'stripes-loader!';

const defaults = {
  root: system.okapi.url,
  pk: 'id',
  clientGeneratePk: true,
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
