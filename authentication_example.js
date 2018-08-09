

/*Part 1------------------------------------------------------------*/
// Here is an example controller for JWT authentication. It includes all routes for creating, updating, deleting, loggin in an logging out

var express = require('express');
var jwt = require('jsonwebtoken');
var bcryptjs = require('bcrypt');
var bodyParser = require('body-parser');
var User = require('../models/User');
// var config = require('../config');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Register/Create new user
router.post('/register', function(req, res) {
  var hashedPassword = bcryptjs.hashSync(req.body.password, 8);
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")

    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
});

//Check User Access Token
router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    User.findById(decoded.id,
      { password: 0 }, // projection
      function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
  });
});
//LOGIN
router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcryptjs.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
});

//LOGOUT
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;





/*Part 2----------------------------------------------------------------*/
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');









/*Part 3----------------------------------------------------------------*/
"dependencies": {
  "bcrypt": "*",
  "body-parser": "^1.18.2",
  "cors": "^2.8.4",
  "express": "^4.16.3",
  "jsonwebtoken": "^8.2.1",
  "mongoose": "^5.2.5"
}








/*Part 4--------------------------------------------------------------*/
// Example JS for logging in and out.
var LogIn;

(function() {
  var instance;

  LogIn = function() {
    if (instance) {
      return instance;
    }

    instance = this;
  }
})();

LogIn.prototype.init = function(){
  this.$loginModal = $("#login-modal");
  this.$loginHeader = $("#log-in-header");

  this._lockScreenModal();
  this._bindEvents();
  this._setTokenPoll();
};

LogIn.prototype._bindEvents = function () {
  this.$loginModal.on("submit", $.proxy(this._handleLogIn, this));
  this.$loginHeader.on("click", ".log-out", $.proxy(this.LogOut, this));
};

//Polls every hours to check and validate token
LogIn.prototype._setTokenPoll = function () {
  setTimeout(() => {
    this.CheckTokenStatus();
  }, 3600000);
};

LogIn.prototype._handleLogIn = function (e) {
  let qsParams = $(e.target).serialize();
  $.post("http://localhost:3000/api/auth/login", qsParams, (jwt)=> {
    this._setToken(jwt);
    this._lockScreenModal();
  }, "json").fail((err)=>{
    console.log(err);
  });
  e.preventDefault();
  return false;
};

LogIn.prototype._switchLogInHeader = function (data) {
  this.$loginHeader.children("span").text("Welcome, Kai!, ");
  this.$loginHeader.children("a").text("Log Out").addClass("log-out");
};

LogIn.prototype._setToken = function (jwt) {
  if(jwt.auth)
  {
    localStorage.setItem("jwt_token", jwt.token);
  }
};

LogIn.prototype._lockScreenModal = function () {
  this.$loginModal.modal({backdrop: "static", keyboard: false, show: this._isLoggedIn()});
};

LogIn.prototype._logInSetStore = function () {
  // $.ajax({
  //   url: "http://localhost:3000/api/auth/login",
  //   type: 'GET',
  //   // Fetch the stored token from localStorage and set in the header
  //   headers: {"Authorization": localStorage.getItem('jwt_token')}
  // });
};

LogIn.prototype.LogOut = function () {
  $.get("http://localhost:3000/api/auth/logout", (data)=> {
    this._dumpToken();
    this._lockScreenModal();
  }, "json");
};

//Checks Token Status at the server (Am I still logged in?)
//This may work well on a timer in a poll
LogIn.prototype.CheckTokenStatus = function () {
  $.ajax({
    url: "http://localhost:3000/api/auth/me",
    type: 'GET',
    dataType: "json",
    // Fetch the stored token from localStorage and set in the header
    headers: {"x-access-token": localStorage.getItem("jwt_token")},
    success: (data) => {
      return data;
    }
  }).fail(()=>{ false });
};

//True or false only
LogIn.prototype._isLoggedIn = function () {
  return this._getToken() ? true : false;
};

//Always checked on page load. Token should be wiped when expired or logged out
LogIn.prototype._getToken = function () {
  return localStorage.getItem("jwt_token") || false;
};

LogIn.prototype._dumpToken = function () {
  localStorage.removeItem("jwt_token");
};

$(function(){
  window.gLogIn = new LogIn();
  window.gLogIn.init();
})





// JWT account needs to be created. Once created user can log-in with creds. End point returns a JWT valid for 24 hours. This token is to be stored in local storage on the client side and set as x-access-token in the request header
// Example JS for the log-in module is not 100%. For example the replacement of the text showing “Hello, User” should come from the response showing the actual users name
// This example outlines a basic JWT authentication from user creation to logging in and out.
// We also have a poll checking to see if the user is still logged in. If the token comes back as invalid or expired we reroute the user to the log-in page.
// Bcrypt is a package we use to encrypt the users password as its communicated to the DB for storage moving in and out of our ReST layer. Is it completely secure? Yes, for the most part. Bcrypt uses an SHA1 encryption mechanism much like HTTPS. It works great for basic application design and user management.
// JWT is a very basic means of authentication. A lot of applications use oAuth these days, allowing us to authenticate through our google or facebook log-ins. Passport is a great resource for this and works on similar principles outside of a third layer of complication with a third party authentication provider.
