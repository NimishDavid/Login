module.exports = function(app, passport, expressValidator) {

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
				if(err)
					throw(err);
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

	app.post('/home/reportBug', isLoggedIn, function(req, res) {

		if(req.user.priority == 1) {
			var message;

			req.assert('bug_name', 'Bug name is required').notEmpty();
		    req.assert('bug_type', 'Bug type is required').notEmpty();
			req.assert('project', 'Project ID is required').notEmpty().isNumeric();
			req.assert('bug_description', 'Bug Description is required').notEmpty().isLength(50,200);
			req.assert('severity', 'Severity is required').notEmpty();
			req.assert('priority', 'Priority is required').notEmpty();
			req.assert('file', 'File is required').notEmpty();
			req.assert('method', 'Method is required').notEmpty();
			req.assert('line', 'Line number is required').notEmpty().isNumeric();

		    var errors = req.validationErrors();
		    if( !errors){   //No errors were found.  Passed Validation!

				var dbQuery = "INSERT INTO `bug_tracker`.`bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `developer_id`) VALUES (NULL, \""+req.body.bug_name+"\", \""+req.body.bug_type+"\", \""+req.body.bug_description+"\", \""+req.body.project+"\", \""+req.body.file+"\", \""+req.body.method+"\", \""+req.body.line+"\", \""+req.body.priority+"\", \""+req.body.severity+"\", \"Open\", NULL)";

				connection.query(dbQuery, function(err, rows){
					if(err)
						throw(err);
					else {
						console.log("Bug report successful");
						message = "success";
						res.render('reportBug.ejs', {
							user : req.user,
							msg : message
						});
					}
				});
		    }
		    else {   //Display errors to user
				console.log("Bug report failed");
				message = "error";
				res.render('reportBug.ejs', {
					user : req.user,
					msg : message
				});
		    }
		}
		else {
			res.end("Forbidden access");
		}

	});

	app.get('/home/unassignedBugs', isLoggedIn, function(req, res) {

		if(req.user.priority == 0) {
			function getProjects() {

				return new Promise(function(resolve, reject) {

					connection.query("SELECT id FROM projects WHERE manager_id = "+req.user.id, function(err, projectsRes){
						if(err)
							reject(err);
						else {
							resolve(projectsRes);
						}
					});

				});

			}

			getProjects()
			.then(function(projectsRes) {
				return new Promise(function(resolve, reject) {
						connection.query("SELECT * FROM bugs WHERE project_id = "+projectsRes.id, function(err, bugsRes){
							if(err)
								reject(err);
							else {
								resolve(bugsRes);
							}
						});
				});
			})
			// .then(function(bugsRes) {
			// 	return new Promise(function(resolve, reject) {
			// 		connection.query("SELECT * FROM project_team WHERE project_id = "+projectsRes.id, function(err, devRes){
			// 			console.log(devRes);
			// 			if(err)
			// 				reject(err);
			// 			else {
			// 				var devs = [];
			// 				devRes.foreach(function(dev) {
			//
			// 				});
			// 			}
			// 		});
			// 	});
			// })
			.then(function(bugsRes,devRes) {
				res.render('bugReports.ejs', {
					user : req.user,
					state: "unassigned",
					resultAdmin: bugsRes
				});
			}).catch(function(err) {
				console.log(err);
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
