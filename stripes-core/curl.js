// curl -v -H "X-Okapi-Tenant-Id: test" -X POST --data-binary @./etc/post.json -H "Content-Type: application/json" 'http://localhost:3030/bundle'
//
// node curl.js "test" "trivial" "trivial-okapi"
//
var request = require('request');

var args = process.argv.slice(2);
var tenant = args[0] || "test";
var module_list = args.slice(1);
if (!module_list.length) {
  module_list = ["trivial", "https://s3.amazonaws.com/folio-ui-bundle/tarball/trivial-wolfram.tgz"];
}

function body_data(modules) {
  var obj = { url: modules };
  
  return JSON.stringify(obj);
}

function webpack_service(tenant, body) {
  var url = 'http://localhost:3030/bundle';
  // Set the headers
  
  var headers = {
      'X-Okapi-Tenant-Id': tenant,
      'User-Agent':       'Webpack Folio UI Agent/0.1.0',
      'Content-Type':     'application/json'
  }
   
  // Configure the request
  var options = {
      method: 'POST',
      url: url,
      headers: headers,
      body: body
  }

  
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 201) {
      console.log(response.headers.location)
    } else {
      console.log("HTTP status for " + url + " " + response.statusCode);
    }
  })
}

/////////////////////////////////////////////////////////////
// main
var body = body_data(module_list);
webpack_service(tenant, body);
