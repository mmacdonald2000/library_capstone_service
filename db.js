// mongodb://<dbuser>:<dbpassword>@ds141661.mlab.com:41661/library-mm-tg

//connect an .env file
require('dotenv').config();

//db.js is our mlabs database connection YOU NEED TO HOOK THIS UP!
var mongoose = require('mongoose');
//you need to add the uri to your database from mlabs and set up a user on that database to log in with!
mongoose.connect(process.env.MDB_USER, { useNewUrlParser: true });
