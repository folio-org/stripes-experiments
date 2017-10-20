import fetch from 'node-fetch';
import queryString from 'query-string';

const okapiTenant = 'diku';
const okapiURL = 'http://localhost:9130';
const okapiToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkaWt1X2FkbWluIiwidXNlcl9pZCI6IjFhZDczN2IwLWQ4NDctMTFlNi1iZjI2LWNlYzBjOTMyY2UwMSIsInRlbmFudCI6ImRpa3UifQ.it38G5UgjExPMpSB7o4dW6X3e3N0zdHWCoOiFY8CT7v4PPdqkn9xonP6PKY_RL0D2SSAH1rgy13ASrn-ij6FiQ';

const headers = {
  'X-Okapi-Tenant': okapiTenant,
  'X-Okapi-Token': okapiToken,
};

let cql = false;
export default {
  Query: {
    hello: () => 'hi!',
    users: (root, { cql }) => { 
      return fetch(`${okapiURL}/users` + (cql ? `?query=${cql}` : ''),
                    { headers }).then((response) => {
	return response.json().then(json => {
	  console.log(json);
	  return json.users;
	});
      });
    },
  }
}
