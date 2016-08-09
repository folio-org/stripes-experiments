var express = require('express');
var app = express();
var port = 3030;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// curl -H "Content-Type: application/json" 
app.use(bodyParser.json());

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

app.get('/readme.html', function (req, res) {
    var fs = require('fs');
    // var markdown = require( "markdown" ).markdown;
    var markdown = require( "markdown-it" )()
      .set({ html: true, breaks: true })
    
    var readme = fs.readFileSync(path.resolve('./README.md'), { encoding: 'utf8' });
    
    res.contentType("text/html");
    res.send( markdown.render(readme));
});

app.get('/readme.md', function (req, res) {
  res.contentType("text/plain");
  res.sendFile( path.resolve('./README.md'))
});

app.get('/favicon.ico', function (req, res) {
  res.contentType("image/png");
  res.sendFile( path.resolve('./stripes-core/favicon.ico'))
});


app.get('/bundle', function (req, res) {
  myapp('get', req, res);
});
app.post('/bundle', function (req, res) {
  myapp('post', req, res);
});

// remove empty entries from list
function cleanup_list(list) {
  var _list = [];
  
  for(var i = 0; i < list.length; i++) {
    if (list[i] != "") {
      _list.push(list[i]);
    }
  }
  return _list;
}

function myapp (type, req, res) {
  var method = type == 'get' ? 'query' : 'body';

  // GET requests read the tenant from an URL parameter, okapi POST requests from HTTP header  
  var tenant = type == 'get' ? req[method].tenant : req.get('X-Okapi-Tenant-Id');
  
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
  //const res_data = JSON.parse(req.body);
  //console.log(req.body);
  
  var ui_url;
  if (typeof req[method].url == 'object') {
    ui_url = cleanup_list(req[method].url).join(" ");
  } else if (typeof req[method].url == 'string') {
    ui_url = req[method].url;
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
      console.log('Run build, may take 20-30 seconds, tenant ' + tenant);
      console.log('UI module: ' + JSON.stringify(cleanup_list(req[method].url)))
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
    var aws_url = { status: 201, url: url };
    
    // res.send("get bundle for tenant " + tenant + " " + req.query.url + result);
    res.location(url);
    res.status(201);
   
    if (type == 'get') { 
      res.send(JSON.stringify(aws_url));
    } else {
      res.send("");
    }
  });
};

app.listen(port, function () {
  console.log('Example app listening on http://localhost:' + port);
});

