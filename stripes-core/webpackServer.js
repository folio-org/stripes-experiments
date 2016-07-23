var express = require('express');
var app = express();
var port = 3030;

var asyncblock = require('asyncblock');
var exec = require('child_process').exec;

app.get('/', function (req, res) {
  res.send("Please use http://localhost:" + port + "/bundle?url=module1&url=module2 ...\n");
});

app.get('/bundle', function (req, res) {
  res.send("get bundle for " + req.query.url);
  
  
  asyncblock(function (flow) {
    // exec('node -v', flow.add());
    var command = 'env ui_url="' + req.query.url.join(" ");
    command += '" ./bin/tenant-bundle.sh';
    
    exec(command, flow.add());
    
    console.log('Run build, may take 1-2 minutes');
    console.log(req.query.url)
    
    result = flow.wait();
    console.log(result);    // There'll be trailing \n in the output

    // Some other jobs
    console.log('More results like if it were sync...');
  });

} );

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});

