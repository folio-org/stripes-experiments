var express = require('express');
var app = express();
var port = 3030;

var asyncblock = require('asyncblock');
var exec = require('child_process').exec;

var cache = {};

app.get('/', function (req, res) {
  res.send("Please use http://localhost:" + port + "/bundle?tenant=tenant&url=module1&url=module2 ...\n");
});

app.get('/bundle', function (req, res) {
  var tenant = req.query.tenant

  var id = [];
  id.push(tenant);
  id.push(req.query.url);
  var id_tag = id.join("|");
  
  asyncblock(function (flow) {
    // exec('node -v', flow.add());
    var command = 'env stripes_tenant="' + tenant + '"' + ' ui_url="' + req.query.url.join(" ");
    command += '" ./bin/tenant-bundle.sh';
    
    exec(command, flow.add());
    
    console.log('Run build, may take 1-2 minutes, tenant ' + tenant);
    console.log(req.query.url)
    
    result = flow.wait();
    console.log(result);    // There'll be trailing \n in the output

    // Some other jobs
    console.log('More results like if it were sync...');
    cache[id_tag] = result;

    var lines = result.split("\n");
    lines.pop();
    var aws_url = { url: lines.pop() };
    
    // res.send("get bundle for tenant " + tenant + " " + req.query.url + result);
    res.send(JSON.stringify(aws_url));
  });

} );

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});

