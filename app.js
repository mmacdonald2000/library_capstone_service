var express = require('express');
var app = express();
var cors = require('cors');
var db = require('./db');
var LibraryController = require('./controllers/library_controller');


// CORS Access lift (we eventually want to add security using JWT and whitelist our platforms)
app.use(cors());

//Include Controller Routes
app.use('/Library', LibraryController);



//this is where we connect all our instances
//export other things to module
module.exports = app;
// console.log(module.exports);
