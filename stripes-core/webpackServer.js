var express = require('express');
var app = express();
var port = 3030;
const path = require('path')

var asyncblock = require('asyncblock');
var exec = require('child_process').exec;

var cache = {};
var error = {}; // global error object
var debug = 1;

app.get('/', function (req, res) {
  // res.send("Please use http://localhost:" + port + "/bundle?tenant=tenant&url=module1&url=module2 ...\n");
  res.sendFile( path.resolve('./stripes-core/webpack.html'))
});

app.get('/bundle', function (req, res) {
  var tenant = req.query.tenant
  if (typeof tenant == 'undefined' || tenant == '') {
    return res.send(JSON.stringify({status: 503, message: 'missing tenant parameter' }));
  }
  if (!tenant.match(/^[[\w\-]+$/)) {
    return res.send(JSON.stringify({status: 503, message: 'wrong tenant parameter [A-Za-z0-9-]+' }));
  }

  //var id = [];
  //id.push(tenant);
  //id.push(req.query.url);
  //var id_tag = id.join("|");
  
  var ui_url;
  if (typeof req.query.url == 'object') {
    ui_url = req.query.url.join(" ");
  } else if (typeof req.query.url == 'string') {
    ui_url = req.query.url;
  } else {
    return res.send(JSON.stringify({status: 503, message: 'missing url parameter' }));
  }
  
  
  
  asyncblock(function (flow) {
    // exec('node -v', flow.add());
    var command = 'env stripes_tenant="' + tenant + '"' + ' ui_url="' + ui_url;
    command += '" ./bin/tenant-bundle.sh';
    
    if (debug >= 1) {
        console.log("Run shell command: " + command)
    }

    flow.errorCallback = function(error) {
        console.log(error)
        return res.send(JSON.stringify({status: 503, message: 'webpack exit with non-zero status' }));
    };
    
    if (debug >= 1) {
      console.log('Run build, may take 1-2 minutes, tenant ' + tenant);
      console.log('UI module: ' + JSON.stringify(req.query.url))
    }
    
    exec(command, flow.add());
    result = flow.wait();
    
    if (debug >= 1) {
      console.log("Webpack script is done");
    }
    
    if (debug >= 2) {
      console.log(result);    // There'll be trailing \n in the output
    }

    // Some other jobs
    // console.log('More results like if it were sync...');
    // cache[id_tag] = result;

    var lines = result.split("\n");
    lines.pop(); // newline
    var url = lines.pop();
    
    if (debug >= 1) {
        console.log("AWS S3 URL: " + url)
    }
    var aws_url = { status: 200, url: url };
    
    // res.send("get bundle for tenant " + tenant + " " + req.query.url + result);
    res.send(JSON.stringify(aws_url));
  });

} );

app.listen(port, function () {
  console.log('Example app listening on http://localhost:' + port);
});

