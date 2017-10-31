import fetch from 'node-fetch';
import queryString from 'query-string';
import _ from 'lodash';

const okapiTenant = 'diku';
const okapiURL = 'http://localhost:9130';
const okapiToken = 'put token here until we replace these constants by actually hooking in as an okapi module';

const headers = {
  'X-Okapi-Tenant': okapiTenant,
  'X-Okapi-Token': okapiToken,
  'Content-type': 'application/json',
};

let cql = false;
export default {
  Query: {
    hello: () => 'hi!',
    users: (root, { cql }) => { 
      return fetch(`${okapiURL}/users` + (cql ? `?query=${cql}` : ''),
                    { headers }).then((response) => {
	return response.json().then(json => {
	  return json.users;
	});
      });
    },
  },

  Mutation: {
    updateUser: (root, updated) => {
      // We don't currently support PATCH so we'll need to grab the record to base our update on
      return fetch(`${okapiURL}/users/${updated.id}`, { headers })
        .then(res => res.json())
        .then((orig) => {
          const record = _.merge({}, orig, updated);
          return fetch(`${okapiURL}/users/${updated.id}`,
                        { headers, method: 'PUT', body: JSON.stringify(record)},)
            .then(res => res.text().then(text => {
              if (res.status < 400) return record;
              throw new Error(text);
            }));
        });
    },
  },
}
