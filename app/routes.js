module.exports = function(app, passport, expressValidator) {
    var async = require('async');
    var dbconfig = require('../config/database');
    var mysql = require('mysql');
    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // Index page
    app.get('/', function(req, res) {
        res.redirect('/login'); // load the index.ejs file
    });

    // Show the login page
    app.get('/login', function(req, res) {

        // Render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // Process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/home', // Redirect to home page if success.
            failureRedirect: '/login', // Redirect back to the login page if there is an error.
            failureFlash: true // Allow flash messages.
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
        if (req.user.class == 0) {
            res.redirect('/home/unassignedBugs');
        }
        if (req.user.class == 1) {
            res.redirect('/home/testerTasks');
        }
        if (req.user.class == 2) {
            res.redirect('/home/devBugReport');
        }
    });

    app.get('/home/testerTasks', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            var projects;
            connection.query("SELECT DISTINCT(projects.id) AS projectId, projects.name AS projectName, projects.manager_id AS managerId, users.name AS managerName  FROM project_team JOIN projects JOIN users ON project_team.project_id = projects.id AND projects.manager_id = users.id WHERE project_team.user_id = ? AND projects.status = 'Open'", [req.user.id], function(err, tasksRes) {
                if (err)
                    throw (err);
                else {
                    console.log(tasksRes);
                    res.render('testerBugReports.ejs', {
                        user: req.user,
                        type: "tasks",
                        resultTes: tasksRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/reportBug', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            var projects;
            connection.query("SELECT * FROM project_team JOIN users JOIN projects ON users.id = project_team.user_id AND project_team.project_id = projects.id WHERE users.id = ? AND projects.status = 'Open'", [req.user.id], function(err, rows) {
                if (err)
                    throw (err);
                else {
                    console.log(rows);
                    res.render('reportBug.ejs', {
                        user: req.user,
                        proj: rows,
                        len: rows.length
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/reportBug', isLoggedIn, function(req, res) {

        if (req.user.class == 1) {
            var message;

            req.assert('bug_name', 'Bug name is required').notEmpty();
            req.assert('bug_type', 'Bug type is required').notEmpty();
            req.assert('project', 'Project ID is required').notEmpty().isNumeric();
            req.assert('bug_description', 'Bug Description is required').notEmpty().isLength(50, 200);
            req.assert('severity', 'Severity is required').notEmpty();
            req.assert('file', 'File is required').notEmpty();
            req.assert('method', 'Method is required').notEmpty();
            req.assert('priority', 'Priority is required').notEmpty();
            req.assert('line', 'Line number is required').notEmpty().isNumeric();
            // req.assert('tester_id', 'Tester ID is required').notEmpty().isNumeric();
            // req.assert('status', 'Status is required').notEmpty();

            var errors = req.validationErrors();
            if (!errors) { //No errors were found.  Passed Validation!

                var dbQuery = "INSERT INTO `bug_tracker`.`bugs` (`id`, `name`, `bug_type`, `description`, `project_id`, `file`, `method`, `line`, `priority`, `severity`, `status`, `tester_id`, `developer_id`) VALUES (NULL, \"" + req.body.bug_name + "\", \"" + req.body.bug_type + "\", \"" + req.body.bug_description + "\", \"" + req.body.project + "\", \"" + req.body.file + "\", \"" + req.body.method + "\", \"" + req.body.line + "\", \"" + req.body.priority + "\", \"" + req.body.severity + "\", \"Open\", \"" + req.user.id + "\" , NULL)";

                connection.query(dbQuery, function(err, rows) {
                    if (err)
                        throw (err);
                    else {
                        console.log("Bug report successful");
                        message = "success";
                        res.render('reportBug.ejs', {
                            user: req.user,
                            msg: message
                        });
                    }
                });
            } else { //Display errors to user
                console.log("Bug report failed");
                console.log(errors);
                message = "error";
                res.render('reportBug.ejs', {
                    user: req.user,
                    msg: message
                });
            }
        } else {
            res.end("Forbidden access");
        }

    });

	function getProjectsTester(req) {
				return new Promise(function(resolve, reject) {
					connection.query("SELECT * FROM project_team JOIN users JOIN projects ON users.id = project_team.user_id AND project_team.project_id = projects.id WHERE users.id = ? AND projects.status = 'Open'", [req.user.id], function(err, projRes) {
						if (err)
							reject(err);
						else {
							console.log("Projects obtained\n");
							resolve(projRes);
						}
					});
				});
	}

	function getBugDetails(req, projRes) { // Get complete details of the bug
		return new Promise(function(resolve, reject) {
			connection.query("SELECT * FROM bugs WHERE bugs.id = ?", [req.params.params], function(err, bugsRes) {
				if (err)
					reject(err);
				else {
					console.log("Bugs obtained\n");
					resolve([projRes, bugsRes]);
				}
			});
		});
	}

	function getBugsEdit(req, projRes) { // For getting bug details after updating details.
		return new Promise(function(resolve, reject) {
			connection.query("SELECT * FROM bugs WHERE bugs.id = ?", [req.body.bug_id], function(err, bugsRes) {
				if (err)
					reject(err);
				else {
					console.log("Bugs obtained\n");
					resolve([projRes, bugsRes]);
				}
			});
		});
	}

	app.get('/home/editBugDetails/:params', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
			getProjectsTester(req).then(function(projRes) {
                return getBugDetails(req, projRes);
            }).then(function(params) {
				res.render('editBugDetails.ejs', {
					user: req.user,
					proj: params[0],
					len: params[0].length,
					bugs: params[1]
				});
			}).catch(function(err) {
				console.log(err);
			});
        }
		else {
            res.end("Forbidden access");
        }
    });

	app.post('/home/editBugDetails', isLoggedIn, function(req, res) {

        if (req.user.class == 1) {

			getProjectsTester(req).then(function(projRes) {
                return getBugsEdit(req, projRes);
            }).then(function(params) {

				var message;

	            req.assert('bug_name', 'Bug name is required').notEmpty();
	            req.assert('bug_type', 'Bug type is required').notEmpty();
	            req.assert('project', 'Project ID is required').notEmpty().isNumeric();
	            req.assert('bug_description', 'Bug Description is required').notEmpty().isLength(50, 200);
	            req.assert('severity', 'Severity is required').notEmpty();
	            req.assert('file', 'File is required').notEmpty();
	            req.assert('method', 'Method is required').notEmpty();
	            req.assert('priority', 'Priority is required').notEmpty();
	            req.assert('line', 'Line number is required').notEmpty().isNumeric();
	            // req.assert('tester_id', 'Tester ID is required').notEmpty().isNumeric();
	            // req.assert('status', 'Status is required').notEmpty();

	            var errors = req.validationErrors();
	            if (!errors) { //No errors were found.  Passed Validation!

	                var dbQuery = "UPDATE bugs SET name = ?, bug_type = ?, project_id = ?, description = ?, file = ?, method = ?, line = ?, severity = ?, priority = ? WHERE bugs.id = ?";

	                connection.query(dbQuery, [req.body.bug_name, req.body.bug_type, req.body.project, req.body.bug_description, req.body.file, req.body.method, req.body.line, req.body.severity, req.body.priority, req.body.bug_id] , function(err, rows) {
	                    if (err)
	                        throw (err);
	                    else {
	                        console.log("Bug edit successful");
	                        message = "success";
	                        res.render('editBugDetails.ejs', {
	                            user: req.user,
	                            msg: message,
								proj: params[0],
								len: params[0].length,
								bugs: params[1]
	                        });
	                    }
	                });
	            } else { //Display errors to user
	                console.log("Bug edit failed");
	                console.log(errors);
	                message = "error";
	                res.render('editBugDetails.ejs', {
	                    user: req.user,
	                    msg: message,
						proj: params[0],
						len: params[0].length,
						bugs: params[1]
	                });
	            }
			}).catch(function(err) {
				console.log(err);
			});
        } else {
            res.end("Forbidden access");
        }

    });

    function getBugsAdmin(req) {

        return new Promise(function(resolve, reject) {

            connection.query("SELECT DISTINCT(bugs.id) AS bugID, project_team.project_id AS projectID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS status, bugs.developer_id AS assignedTo FROM projects JOIN project_team JOIN bugs WHERE projects.manager_id = ? AND project_team.project_id = bugs.project_id AND bugs.project_id = projects.id AND projects.status = 'Open'", [req.user.id], function(err, bugsRes) {
                if (err)
                    reject(err);
                else {
                    resolve(bugsRes);
                }
            });

        });

    }

    app.get('/home/unassignedBugs', isLoggedIn, function(req, res) {

        if (req.user.class == 0) {

            getBugsAdmin(req).then(function(bugsRes) {
                    return new Promise(function(resolve, reject) {
                        var dbQuery = "SELECT project_team.user_id AS devID, users.name AS devName FROM projects JOIN project_team JOIN users ON projects.manager_id = ? AND projects.id = project_team.project_id AND project_team.user_id = users.id AND users.class = 2";
                        connection.query(dbQuery, [req.user.id], function(err, devRes) {
                            if (err)
                                reject(err);
                            else {
                                resolve([bugsRes, devRes]);
                            }
                        });
                    });
                }).then(function(params) {
                    var bugsRes = params[0];
                    var devRes = params[1];

                    res.render('bugReports.ejs', {
                        user: req.user,
                        state: "unassigned",
                        resultAdmin: bugsRes,
                        devs: devRes
                    });
                }).catch(function(err) {
                    console.log(err);
                });

        } else {
            res.end("Forbidden access");
        }

    });

    app.post('/home/unassignedBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('dev').notEmpty().isInt();
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                var dbQuery = "UPDATE bugs SET developer_id = ?, status = 'Assigned' WHERE id = ?";
                connection.query(dbQuery, [req.body.dev, req.body.bug], function(err, devRes) {
                    if (err)
                        console.log(err);
                    else {
                        console.log("Bug assigned to developer");
                        res.send("Bug assigned to developer");
                    }
                });
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/assignedBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {

            getBugsAdmin(req).then(function(bugsRes) {
                    res.render('bugReports.ejs', {
                        user: req.user,
                        state: "assigned",
                        resultAdmin: bugsRes
                    });
                }).catch(function(err) {
                    console.log(err);
                });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/closedBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {

            getBugsAdmin(req).then(function(bugsRes) {
                    res.render('bugReports.ejs', {
                        user: req.user,
                        state: "closed",
                        resultAdmin: bugsRes
                    });
                }).catch(function(err) {
                    console.log(err);
                });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/devBugReport', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.file AS file, bugs.method AS method, bugs.line AS line, bugs.status AS status, bugs.developer_id AS assignedTo FROM bugs JOIN projects ON bugs.project_id = projects.id AND projects.status = 'Open' AND bugs.developer_id = ? AND (bugs.status = 'Assigned' OR bugs.status = 'Review')", [req.user.id], function(err, bugsRes) {
                if (err)
                    console.log(err);
                else {
                    res.render('devBugReports.ejs', {
                        user: req.user,
                        type: "open",
                        resultDev: bugsRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/devBugReport', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            req.assert('status').notEmpty();
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                var dbQuery = "UPDATE bugs SET status = ? WHERE id = ?";
                connection.query(dbQuery, [req.body.status, req.body.bug], function(err, rows) {
                    if (err)
                        console.log(err);
                    else {
                        // console.log("Database update successful");
                        res.send("Bug status changed successfully");
                    }
                });
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/devRejected', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS rejectType, users.name AS tester FROM bugs JOIN users JOIN projects WHERE developer_id = ? AND (bugs.status = 'Review Reject' OR bugs.status = 'Approve Reject') AND users.id = bugs.tester_id AND bugs.project_id = projects.id AND projects.status = 'Open'", [req.user.id], function(err, rejectRes) {
                if (err)
                    console.log(err);
                else {
                    res.render('devBugReports.ejs', {
                        user: req.user,
                        type: "reject",
                        resultDev: rejectRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/devBugHistory', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            connection.query("SELECT * FROM bugs WHERE developer_id = " + req.user.id + " AND status NOT IN ('Assigned', 'Resolving')", function(err, bugsRes) {
                if (err)
                    console.log(err);
                else {
                    res.render('devBugReports.ejs', {
                        user: req.user,
                        type: "history",
                        resultDev: bugsRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/reviewBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.file AS file, bugs.method AS method, bugs.line AS line, bugs.status AS status, bugs.developer_id AS assignedTo FROM bugs JOIN projects ON bugs.project_id = projects.id AND projects.status = 'Open' AND tester_id = ? AND bugs.status = 'Review'", [req.user.id], function(err, bugsRes) {
                if (err)
                    console.log(err);
                else {
                    res.render('testerBugReports.ejs', {
                        user: req.user,
                        type: "review",
                        resultTes: bugsRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/reviewBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            req.assert('status').notEmpty();
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                var dbQuery = "UPDATE bugs SET status = '" + req.body.status + "' WHERE id = " + req.body.bug;
                connection.query(dbQuery, function(err, devRes) {
                    if (err)
                        console.log(err);
                    else {
                        // console.log("Database update successful");
                        res.send("Bug status changed successfully");
                    }
                });
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/trackBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.file AS file, bugs.method AS method, bugs.line AS line, bugs.status AS status, bugs.developer_id AS assignedTo FROM bugs JOIN projects ON bugs.project_id = projects.id AND projects.status = 'Open' AND tester_id = ? AND bugs.status NOT IN ('Review')", [req.user.id], function(err, bugsRes) {
                if (err)
                    console.log(err);
                else {
                    res.render('testerBugReports.ejs', {
                        user: req.user,
                        type: "track",
                        resultTes: bugsRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.get('/home/approveBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            connection.query("SELECT bugs.id AS bugid, bugs.name AS bugname, bugs.bug_type AS bugtype, bugs.description AS description, bugs.priority AS priority, bugs.severity as severity, users.name AS assignedto, bugs.status AS status FROM projects JOIN bugs JOIN users ON bugs.project_id = projects.id AND projects.manager_id = ? AND bugs.developer_id = users.id AND bugs.status = 'Approval' AND projects.status = 'Open'", [req.user.id], function(err, bugsRes) {
                if (err)
                    console.log(err);
                else {
                    console.log(bugsRes);
                    res.render('bugReports.ejs', {
                        user: req.user,
                        state: "approve",
                        resultAdmin: bugsRes
                    });
                }
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/approveBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('status').notEmpty();
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                var dbQuery = "UPDATE bugs SET status = '" + req.body.status + "' WHERE id = " + req.body.bug;
                connection.query(dbQuery, function(err, devRes) {
                    if (err)
                        console.log(err);
                    else {
                        // console.log("Database update successful");
                        res.send("Bug status changed successfully");
                    }
                });
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            res.end("Forbidden access");
        }
    });

    function getTestersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS testerId, users.name AS testerName, projects.id AS projectId FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id = ? AND projects.status = 'Open'";
            connection.query(dbQuery1, [req.user.id], function(err, testResRem) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, testResRem]);
                }
            });
        });
    }

    function getTestersAdd(req, projectsRes, testResRem) {
        return new Promise(function(resolve, reject) {
            var dbQuery2 = "SELECT DISTINCT(users.id) AS testerId, users.name AS testerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id != ? AND projects.status = 'Open' WHERE users.id NOT IN (SELECT users.id FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id = ?)";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, testResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, testResRem, testResAdd]);
                }
            });
        });
    }

    app.get('/home/manageTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            getProjectsManage(req).then(function(projectsRes) {
                return getTestersRem(req, projectsRes);
            }).then(function(params){
                return getTestersAdd(req, params[0], params[1]);
            }).then(function(params) {
                res.render('manageTesters.ejs', {
                    user: req.user,
                    projects: params[0],
                    testersRem: params[1],
                    testersAdd: params[2]
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageTesters/addTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
                var vals = "";
                req.body.testers.forEach(function(item, index) {
                    vals += "(" + req.body.project_id + ", " + item + "), ";
                });
                vals = vals.slice(0, -2);
                dbQuery = "INSERT INTO project_team (project_id, user_id) VALUES " + vals;
                console.log(dbQuery);
                connection.query(dbQuery, function(err, rows) {
                    if (err) {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getTestersRem(req, projectsRes);
                        }).then(function(params){
                            return getTestersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageTesters.ejs', {
                                user: req.user,
                                projects: params[0],
                                testersRem: params[1],
                                testersAdd: params[2],
                                msg: "failAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    } else {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getTestersRem(req, projectsRes);
                        }).then(function(params){
                            return getTestersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageTesters.ejs', {
                                user: req.user,
                                projects: params[0],
                                testersRem: params[1],
                                testersAdd: params[2],
                                msg: "successAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageTesters/removeTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            function removeTester() {
                return new Promise(function(resolve, reject) {
                    dbQuery = "SELECT id FROM projects WHERE manager_id = ? AND projects.status = 'Open'";
                    connection.query(dbQuery, [req.user.id], function(err, rows) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
            removeTester().then(function(params) {
                // console.log(params[0].id);
                console.log(req.body.testers);
                var t = "";
                req.body.testers.forEach(function(item, index) {
                    t += item + ", ";
                });
                t = t.slice(0, -2);
                dbQuery = "DELETE FROM project_team WHERE user_id IN (" + t + ") AND project_id = ?";
                connection.query(dbQuery, [params[0].id], function(err, rows) {
                    if (err) {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getTestersRem(req, projectsRes);
                        }).then(function(params){
                            return getTestersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageTesters.ejs', {
                                user: req.user,
                                projects: params[0],
                                testersRem: params[1],
                                testersAdd: params[2],
                                msg: "failAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    } else {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getTestersRem(req, projectsRes);
                        }).then(function(params){
                            return getTestersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageTesters.ejs', {
                                user: req.user,
                                projects: params[0],
                                testersRem: params[1],
                                testersAdd: params[2],
                                msg: "successAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            res.end("Forbidden access");
        }
    });

    function getDevelopersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS developerId, users.name AS developerName, projects.id AS projectId FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id = ? AND projects.status = 'Open'";
            connection.query(dbQuery1, [req.user.id], function(err, devResRem) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, devResRem]);
                }
            });
        });
    }

    function getDevelopersAdd(req, projectsRes, devResRem) {
        return new Promise(function(resolve, reject) {
            var dbQuery2 = "SELECT DISTINCT(users.id) AS developerId, users.name AS developerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id != ? AND projects.status = 'Open' WHERE users.id NOT IN (SELECT users.id FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id = ?)";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, devResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, devResRem, devResAdd]);
                }
            });
        });
    }

    app.get('/home/manageDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            getProjectsManage(req).then(function(projectsRes) {
                return getDevelopersRem(req, projectsRes);
            }).then(function(params){
                return getDevelopersAdd(req, params[0], params[1]);
            }).then(function(params) {
                res.render('manageDevelopers.ejs', {
                    user: req.user,
                    projects: params[0],
                    developersRem: params[1],
                    developersAdd: params[2]
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageDevelopers/addDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
                var vals = "";
                req.body.developers.forEach(function(item, index) {
                    vals += "(" + req.body.project_id + ", " + item + "), ";
                });
                vals = vals.slice(0, -2);
                dbQuery = "INSERT INTO project_team (project_id, user_id) VALUES " + vals;
                connection.query(dbQuery, function(err, rows) {
                    if (err) {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getDevelopersRem(req, projectsRes);
                        }).then(function(params){
                            return getDevelopersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageDevelopers.ejs', {
                                user: req.user,
                                projects: params[0],
                                developersRem: params[1],
                                developersAdd: params[2],
                                msg: "failAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    } else {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getDevelopersRem(req, projectsRes);
                        }).then(function(params){
                            return getDevelopersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageDevelopers.ejs', {
                                user: req.user,
                                projects: params[0],
                                developersRem: params[1],
                                developersAdd: params[2],
                                msg: "successAdd"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageDevelopers/removeDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            function removeDeveloper() {
                return new Promise(function(resolve, reject) {
                    dbQuery = "SELECT id FROM projects WHERE manager_id = ? AND projects.status = 'Open'";
                    connection.query(dbQuery, [req.user.id], function(err, rows) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
            removeDeveloper().then(function(params) {
                // console.log(params[0].id);
                console.log(req.body.developers);
                var t = "";
                req.body.developers.forEach(function(item, index) {
                    t += item + ", ";
                });
                t = t.slice(0, -2);
                console.log(t);
                console.log(params[0].id);
                dbQuery = "DELETE FROM project_team WHERE user_id IN (" + t + ") AND project_id = ?";
                connection.query(dbQuery, [params[0].id], function(err, rows) {
                    if (err) {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getDevelopersRem(req, projectsRes);
                        }).then(function(params){
                            return getDevelopersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageDevelopers.ejs', {
                                user: req.user,
                                projects: params[0],
                                developersRem: params[1],
                                developersAdd: params[2],
                                msg: "failRem"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    } else {
                        getProjectsManage(req).then(function(projectsRes) {
                            return getDevelopersRem(req, projectsRes);
                        }).then(function(params){
                            return getDevelopersAdd(req, params[0], params[1]);
                        }).then(function(params) {
                            res.render('manageDevelopers.ejs', {
                                user: req.user,
                                projects: params[0],
                                developersRem: params[1],
                                developersAdd: params[2],
                                msg: "successRem"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            res.end("Forbidden access");
        }
    });

    function getProjectsManage(req) {
      return new Promise(function(resolve, reject) {
        connection.query("SELECT * FROM projects WHERE manager_id = ? AND status = 'Open'", [req.user.id], function(err, projectsRes) {
            if (err) {
                reject(err);
            } else {
                resolve(projectsRes);
            }
        });
      });
    }

    app.get('/home/manageProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          getProjectsManage(req).then(function(projectsRes) {
            res.render('manageProjects.ejs', {
              user: req.user,
              projects: projectsRes
            });
          }).catch(function(err) {
            console.log(err);
          });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageProjects/addProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          function addProject() {
            return new Promise(function(resolve, reject) {
              connection.query("INSERT INTO projects (name, manager_id) VALUES (?, ?)", [req.body.project_name, req.user.id], function(err, rows) {
                  if (err) {
                      reject(err);
                  } else {
                      resolve();
                  }
              });
            });
          }
          addProject().then(function() {
            return getProjectsManage(req);
          }).then(function(projectsRes) {
            res.render('manageProjects.ejs', {
              user: req.user,
              projects: projectsRes,
              msg : "successAdd"
            });
          }).catch(function(err) {
            res.render('manageProjects.ejs', {
              user: req.user,
              projects: projectsRes,
              msg : "failAdd"
            });
          });
        } else {
            res.end("Forbidden access");
        }
    });

    app.post('/home/manageProjects/removeProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          function removeProject() {
            return new Promise(function(resolve, reject) {
              var t = "";
              req.body.projects.forEach(function(item, index) {
                  t += item + ", ";
              });
              t = t.slice(0, -2);
              dbQuery = "UPDATE projects SET status = 'Closed' WHERE id IN (" + t + ") AND manager_id = ?";
              connection.query(dbQuery, [req.user.id], function(err, rows) {
                  if (err) {
                      reject(err);
                  } else {
                      resolve();
                  }
              });
            });
          }
          removeProject().then(function() {
            return getProjectsManage(req);
          }).then(function(projectsRes) {
            res.render('manageProjects.ejs', {
              user: req.user,
              projects: projectsRes,
              msg : "successRem"
            });
          }).catch(function(err) {
            res.render('manageProjects.ejs', {
              user: req.user,
              projects: projectsRes,
              msg : "failRem"
            });
          });
        } else {
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
    res.redirect('/login');
}
