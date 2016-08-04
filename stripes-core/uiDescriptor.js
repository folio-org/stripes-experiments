var request = require('request');

var args = process.argv.slice(2);
var url = args[0];

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  } else {
    console.log("HTTP status for " + url + " " + response.statusCode);
  }
})

