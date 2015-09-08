/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
BARTER

GOAL: Design a flexible shop/store system for virtual items. 

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


/*=============================
REQUIRES
=============================*/

//For making coding easier
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');

//For databases
var sqlite3 = require('sqlite3');
var dbFile = './db/db.sqlite';
var db = new sqlite3.Database(dbFile);

//For input security
var validator = require('validator');
var crypto = require('crypto'); 

//For user sessions/validation/authentication
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;


//Files we create to externalize page handling will go here.
/*PLACEHOLDER COMMENT*/

/*=============================
MIDDLEWARE
=============================*/

//Using Express as "app"
var app = express();

//Setting EJS as our view engine
app.set('view engine', 'ejs');

//Middleware for page handling 
app.use(session({secret: 'houseshoes', resave:true, saveUninitialized:true})); //Sessions (express).
app.use(bodyParser.urlencoded({ extended: false })); //Parsing webpage bodies for information. 
app.use(cookieParser('clandestine coin')); //Cookies.
app.use(passport.initialize()); //Initializes passport.
app.use(passport.session()); //Sessions (passport).

//Externalized (Globalized) variables and functions will go here. 
/*PLACEHOLDER COMMENT*/

//Passport LocalStrategy will go here.
/*PLACEHOLDER COMMENT*/

//Passport Serialization
passport.serializeUser(function (user,done) {
	done(null,user);
});
passport.deserializeUser(function (user,done) {
	done(null,user);
});

//Express Directory -- In this case, it's /views.
app.use(express.static(__dirname + '/views/'));


/*=============================
GET (app.get)
=============================*/


/*=============================
POST (app.post)
=============================*/


/*=============================
LISTENING (localhost:3000)
=============================*/
app.listen(3000);
console.log('Server functional. Please use http://localhost:3000/ to access pages.');