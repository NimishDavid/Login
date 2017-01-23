var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressValidator = require('express-validator');
var forEach = require('async-foreach').forEach;
var app      = express();
var port     = process.env.PORT || 8000;

var passport = require('passport');
var flash    = require('connect-flash');

// Configuration connect to database

require('./config/passport')(passport); // Pass passport for configuration

// Set up our express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // Read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());

app.set('view engine', 'ejs'); // Set up ejs for templating

// Required for passport
app.use(session({
	secret: 'nimishdm',
	resave: true,
	saveUninitialized: true
} )); // Session secret
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/uploads'));

// Load routes passing app and passport
require('./app/routes.js')(app, passport,expressValidator);

// Start Server
app.listen(port);
console.log('Server listening at port ' + port);
