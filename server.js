//This is how we include multiple js files without an index.html to bind them
var http = require('http');
var app = require('./app.js');
var hostname = '127.0.0.1';
//process.env.PORT means the next available port;
var port = process.env.PORT || 3002;

//Listen to app on port (Everything routes through app)
var server = app.listen(port, function() {
  console.log('                ');
  console.log('Express server listening on port ' + port);
  console.log('                ');
});
