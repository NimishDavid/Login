module.exports = function(app, passport, expressValidator) {
	var async = require('async');
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
			connection.query("SELECT * FROM project_team JOIN users JOIN projects ON users.id = project_team.user_id AND project_team.project_id = projects.id WHERE users.id = ?",[req.user.id], function(err, rows){
				if(err)
					throw(err);
					else {
						console.log(rows);
						res.render('reportBug.ejs', {
							user : req.user,
							proj : rows,
							len : rows.length
						});
					}
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
			// req.assert('tester_id', 'Tester ID is required').notEmpty().isNumeric();
			// req.assert('status', 'Status is required').notEmpty();

		    var errors = req.validationErrors();
		    if( !errors){   //No errors were found.  Passed Validation!

				var dbQuery = "INSERT INTO `bug_tracker`.`bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `tester_id`, `developer_id`) VALUES (NULL, \""+req.body.bug_name+"\", \""+req.body.bug_type+"\", \""+req.body.bug_description+"\", \""+req.body.project+"\", \""+req.body.file+"\", \""+req.body.method+"\", \""+req.body.line+"\", \""+req.body.priority+"\", \""+req.body.severity+"\", \"Open\", \""+ req.user.id +"\" , NULL)";

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
						connection.query("SELECT * FROM bugs WHERE project_id = "+projectsRes[0].id, function(err, bugsRes){
							if(err)
								reject(err);
							else {
								resolve([projectsRes, bugsRes]);
							}
						});
				});
			}).then(function(params) {
				return new Promise(function(resolve, reject) {
					var projectsRes = params[0];
					var bugsRes = params[1];
					var dbQuery =    "SELECT * FROM project_team JOIN users ON users.id = project_team.user_id WHERE priority = 2 AND project_id = "+projectsRes[0].id;
					connection.query(dbQuery, function(err, devRes){
						if(err)
							reject(err);
						else {
							resolve([projectsRes, bugsRes, devRes]);
						}
					});
				});
			}).then(function(params) {
				var projectsRes = params[0];
				var bugsRes = params[1];
				var devRes = params[2];

				res.render('bugReports.ejs', {
					user : req.user,
					state: "unassigned",
					resultAdmin: bugsRes,
					devs : devRes
				});
			}).catch(function(err) {
				console.log(err);
			});

		}
		else {
			res.end("Forbidden access");
		}

	});

	app.post('/home/unassignedBugs', isLoggedIn, function(req, res) {
		if(req.user.priority == 0) {
			req.assert('dev').notEmpty().isInt();
			req.assert('bug').notEmpty().isInt();
			var errors = req.validationErrors();
		    if( !errors){
				var dbQuery = "UPDATE bugs SET developer_id = "+req.body.dev+", status = 'Assigned' WHERE id = "+req.body.bug;
				connection.query(dbQuery, function(err, devRes){
					if(err)
						console.log(err);
					else {
						console.log("Bug assigned to developer");
						res.send("Bug assigned to developer");
					}
				});
			}
			else {
				console.log("Invalid input");
				res.end("Invalid input");
			}
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/assignedBugs', isLoggedIn, function(req, res) {
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
						connection.query("SELECT * FROM bugs WHERE project_id = "+projectsRes[0].id, function(err, bugsRes){
							if(err)
								reject(err);
							else {
								resolve([projectsRes, bugsRes]);
							}
						});
				});
			}).then(function(params) {
				return new Promise(function(resolve, reject) {
					var projectsRes = params[0];
					var bugsRes = params[1];
					var dbQuery =    "SELECT * FROM project_team JOIN users ON users.id = project_team.user_id WHERE priority = 2 AND project_id = "+projectsRes[0].id;
					connection.query(dbQuery, function(err, devRes){
						if(err)
							reject(err);
						else {
							resolve([projectsRes, bugsRes, devRes]);
						}
					});
				});
			}).then(function(params) {
				var projectsRes = params[0];
				var bugsRes = params[1];
				var devRes = params[2];
				console.log(devRes);

				res.render('bugReports.ejs', {
					user : req.user,
					state: "assigned",
					resultAdmin: bugsRes,
					devs : devRes
				});
			}).catch(function(err) {
				console.log(err);
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/closedBugs', isLoggedIn, function(req, res) {
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
						connection.query("SELECT * FROM bugs WHERE project_id = "+projectsRes[0].id, function(err, bugsRes){
							if(err)
								reject(err);
							else {
								resolve([projectsRes, bugsRes]);
							}
						});
				});
			}).then(function(params) {
				return new Promise(function(resolve, reject) {
					var projectsRes = params[0];
					var bugsRes = params[1];
					var dbQuery =    "SELECT * FROM project_team JOIN users ON users.id = project_team.user_id WHERE priority = 2 AND project_id = "+projectsRes[0].id;
					connection.query(dbQuery, function(err, devRes){
						if(err)
							reject(err);
						else {
							resolve([projectsRes, bugsRes, devRes]);
						}
					});
				});
			}).then(function(params) {
				var projectsRes = params[0];
				var bugsRes = params[1];
				var devRes = params[2];
				console.log(devRes);

				res.render('bugReports.ejs', {
					user : req.user,
					state: "closed",
					resultAdmin: bugsRes,
					devs : devRes
				});
			}).catch(function(err) {
				console.log(err);
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/devBugReport', isLoggedIn, function(req, res) {
		if(req.user.priority == 2) {
			connection.query("SELECT * FROM bugs WHERE developer_id = "+req.user.id+" AND (status = 'Assigned' OR status = 'Resolving')", function(err, bugsRes){
				if(err)
					console.log(err);
				else {
					res.render('devBugReports.ejs', {
						user : req.user,
						type : "open",
						resultDev: bugsRes
					});
				}
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.post('/home/devBugReport', isLoggedIn, function(req, res) {
		if(req.user.priority == 2) {
			req.assert('status').notEmpty();
			req.assert('bug').notEmpty().isInt();
			var errors = req.validationErrors();
		    if( !errors){
				var dbQuery = "UPDATE bugs SET status = '"+ req.body.status +"' WHERE id = "+req.body.bug;
				connection.query(dbQuery, function(err, devRes){
					if(err)
						console.log(err);
					else {
						// console.log("Database update successful");
						res.send("Bug status changed successfully");
					}
				});
			}
			else {
				console.log("Invalid input");
				res.end("Invalid input");
			}
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/devBugHistory', isLoggedIn, function(req, res) {
		if(req.user.priority == 2) {
			connection.query("SELECT * FROM bugs WHERE developer_id = "+req.user.id+" AND status NOT IN ('Assigned', 'Resolving')", function(err, bugsRes){
				if(err)
					console.log(err);
				else {
					res.render('devBugReports.ejs', {
						user : req.user,
						type : "history",
						resultDev: bugsRes
					});
				}
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/reviewBugs', isLoggedIn, function(req, res) {
		if(req.user.priority == 1) {
			connection.query("SELECT * FROM bugs WHERE tester_id = "+req.user.id+" AND status = 'Review'", function(err, bugsRes){
				if(err)
					console.log(err);
				else {
					res.render('testerBugReports.ejs', {
						user : req.user,
						type : "review",
						resultTes: bugsRes
					});
				}
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.post('/home/reviewBugs', isLoggedIn, function(req, res) {
		if(req.user.priority == 1) {
			req.assert('status').notEmpty();
			req.assert('bug').notEmpty().isInt();
			var errors = req.validationErrors();
		    if( !errors){
				var dbQuery = "UPDATE bugs SET status = '"+ req.body.status +"' WHERE id = "+req.body.bug;
				connection.query(dbQuery, function(err, devRes){
					if(err)
						console.log(err);
					else {
						// console.log("Database update successful");
						res.send("Bug status changed successfully");
					}
				});
			}
			else {
				console.log("Invalid input");
				res.end("Invalid input");
			}
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/trackBugs', isLoggedIn, function(req, res) {
		if(req.user.priority == 1) {
			connection.query("SELECT * FROM bugs WHERE tester_id = "+req.user.id+" AND status NOT IN ('Review')", function(err, bugsRes){
				if(err)
					console.log(err);
				else {
					res.render('testerBugReports.ejs', {
						user : req.user,
						type : "track",
						resultTes: bugsRes
					});
				}
			});
		}
		else {
			res.end("Forbidden access");
		}
	});

	app.get('/home/approveBugs', isLoggedIn, function(req, res) {
		if(req.user.priority == 0) {
			connection.query("SELECT * FROM projects JOIN bugs JOIN users ON bugs.project_id = projects.id AND projects.manager_id = ? AND bugs.developer_id = users.id AND bugs.status = 'Approval'", [req.user.id], function(err, bugsRes){
				if(err)
					console.log(err);
				else {
					console.log(bugsRes);
					res.render('bugReports.ejs', {
						user : req.user,
						state : "approve",
						resultAdmin: bugsRes
					});
				}
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
