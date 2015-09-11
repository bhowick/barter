/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
BARTER

GOAL: Design a flexible shop/store system for virtual items. 

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/


/*=======================================================================================
REQUIRES
=======================================================================================*/

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
var indexHandler = require('./lib/indexHandler.js');
var registerHandler = require('./lib/registerHandler.js');
var addItemHandler = require('./lib/addItemHandler.js');
var viewAllHandler = require('./lib/viewAllHandler.js');
var viewItemHandler = require('./lib/viewItemHandler.js');
var editItemHandler = require('./lib/editItemHandler.js');
var deleteConfirmHandler = require('./lib/deleteConfirmHandler.js');
var globalTokens = require('./lib/globalTokens.js');

/*=======================================================================================
MIDDLEWARE
=======================================================================================*/

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
app.use(globalTokens);
app.use(function (req,res,next) {
	req.db = db;
	next();
});

//Passport LocalStrategy -- Borrowed from Testing, for now. :P
passport.use(new LocalStrategy(
	function(username, password, done) {
		db.get('SELECT * FROM users WHERE name = ?', username, function(err,user) { //"user" is the row itself.
			if(err) { //If the query errors out.
				return done(err);
			}
			if(!user) { //If the user doesn't exist.
				return done(null, false, { message: 'Username not found.' });
			}
			//Crypto stuff time.
			var iter = 1000; //Number of hash iterations. Apparently 1000 is recommended. Might also be unnecessary.
			var hashLength = 64; //How long you want the hash to be (bytes).
			var hashType = 'sha256'; //The type of hash to be used.
			var hashedKey = crypto.pbkdf2Sync(password, user.salt, iter, hashLength, hashType); //The actual hashing... thing. Makes raw bytes.
			var hashedPassword = hashedKey.toString('hex');//Takes the bytes and makes a nice string out of them.
			
			if(!user.pass || user.pass != hashedPassword) { //If the user's password is empty or doesn't exist.
				return done(null, false, { message: 'Incorrect password.' });
			}
			var d = new Date();
			var timeStamp = Math.floor(d.getTime()/1000); //We want a workable date in Unix timestamp seconds.
			var newQuery = [timeStamp, user.userID]; //The array to put into the query to update it.

			db.run('UPDATE users SET lastLogin = ? WHERE userID = ?', newQuery, function(err) {
				if(err) {
					return done(err);
				}
				console.log('The user"' + user.name + '" has logged in successfully.');
			});
			var userID = user.userID;
			return done(null, userID); //Returns the user ID as an object if everything checks out.
		});

	}
));

//Passport Serialization
passport.serializeUser(function (user,done) {
	done(null,user);
});
passport.deserializeUser(function (user,done) {
	done(null,user);
});

//Express Directory -- In this case, it's /views.
app.use(express.static(__dirname + '/views/'));


/*=======================================================================================
GET (app.get)
=======================================================================================*/
app.get('/', indexHandler.GET);
app.get('/register', registerHandler.GET);
app.get('/addItem', addItemHandler.GET);
app.get('/viewAll', viewAllHandler.GET);
app.get('/viewItem', viewItemHandler.GET);
app.get('/editItem', editItemHandler.GET);
app.get('/deleteConfirm', deleteConfirmHandler.GET);


/*=======================================================================================
POST (app.post)
=======================================================================================*/
app.post('/',indexHandler.POST);
app.post('/register', registerHandler.POST);
app.post('/addItem', addItemHandler.POST);
app.post('/viewAll', viewAllHandler.POST);
app.post('/viewItem', viewItemHandler.POST);
app.post('/editItem', editItemHandler.POST);
app.post('/deleteConfirm', deleteConfirmHandler.POST);


/*=======================================================================================
LOGINS (app.get, app.post)
=======================================================================================*/
app.get('/login', function (req,res) {
	res.render('pages/login');
});
app.get('/loginFailure', function(req,res) {
	console.log('Failed to authenticate user.');
	res.redirect('/login');
});
app.get('/loginSuccess', function(req,res) {
	console.log('Successfully authenticated user.');
	res.redirect('/');
});
app.post('/login', passport.authenticate('local', {
	successRedirect: '/loginSuccess',
	failureRedirect: '/loginFailure'
}));


/*=======================================================================================
LISTENING (localhost:3000)
=======================================================================================*/
app.listen(3000);
console.log('Server functional. Please use http://localhost:3000/ to access pages.');
