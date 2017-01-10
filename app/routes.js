module.exports = function(app, passport) {

	var dbconfig = require('../config/database');
	var mysql = require('mysql');
	var connection = mysql.createConnection(dbconfig.connection);
	connection.query('USE ' + dbconfig.database);

	// Index page
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// Show the login page
	app.get('/login', function(req, res) {

		// Render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// Process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // Redirect to home page if success.
            failureRedirect : '/login', // Redirect back to the login page if there is an error.
            failureFlash : true // Allow flash messages.
		}),
        function(req, res) {
            console.log("Login success");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// Home page. Login verified using isLoggedIn.
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs', {
			user : req.user // Get the user out of session and pass to template.
		});
	});

	app.get('/home/reportBug', isLoggedIn, function(req, res) {
		if(req.user.priority == 1) {
			var projects;
			connection.query("SELECT * FROM projects", function(err, rows){
                if (err)
                    return (err);
                if (!rows.length) {
                    return ("No data"); // req.flash is the way to set flashdata using connect-flash
                }
				res.render('reportBug.ejs', {
					user : req.user,
					proj : rows,
					len : rows.length
				});
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	// Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// Route middleware to verify login.
function isLoggedIn(req, res, next) {

	// If user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// If they aren't, redirect them to the index page
	res.redirect('/');
}
