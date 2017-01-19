module.exports = function (app, passport, expressValidator, connection, isLoggedIn) {

    app.get('/tester/testerTasks', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/tester/reportBug', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/tester/reportBug', isLoggedIn, function(req, res) {

        if (req.user.class == 1) {
            var message;

            req.assert('bug_name', 'Bug name is required').notEmpty().isLength(5, 50);
            req.assert('bug_type', 'Bug type is required').notEmpty().isIn(['Type A', 'Type B', 'Type C']);
            req.assert('project', 'Project ID is required').notEmpty().isNumeric();
            req.assert('bug_description', 'Bug Description is required').notEmpty().isLength(50, 500);
            req.assert('severity', 'Severity is required').notEmpty().isIn(['Major', 'Minor', 'Critical']);
            req.assert('file', 'File is required').notEmpty();
            req.assert('method', 'Method is required').notEmpty();
            req.assert('priority', 'Priority is required').notEmpty().isIn(['Low', 'Moderate', 'High']);
            req.assert('line', 'Line number is required').notEmpty().isNumeric();

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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }

    });

    app.get('/tester/reviewBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/tester/reviewBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 1) {
            req.assert('status').notEmpty().isIn(['Review Reject', 'Approval']);
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/tester/trackBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/tester/reportBug/editBugDetails/:params', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/tester/reportBug/editBugDetails/', isLoggedIn, function(req, res) {

        if (req.user.class == 1) {

            getProjectsTester(req).then(function(projRes) {
                return getBugsEdit(req, projRes);
            }).then(function(params) {

                var message;

                req.assert('bug_name', 'Bug name is required').notEmpty().isLength(5, 50);
                req.assert('bug_type', 'Bug type is required').notEmpty().isIn(['Type A', 'Type B', 'Type C']);
                req.assert('project', 'Project ID is required').notEmpty().isNumeric();
                req.assert('bug_description', 'Bug Description is required').notEmpty().isLength(50, 500);
                req.assert('severity', 'Severity is required').notEmpty().isIn(['Major', 'Minor', 'Critical']);
                req.assert('file', 'File is required').notEmpty();
                req.assert('method', 'Method is required').notEmpty();
                req.assert('priority', 'Priority is required').notEmpty().isIn(['Low', 'Moderate', 'High']);
                req.assert('line', 'Line number is required').notEmpty().isNumeric();

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
            console.log("Forbidden access");
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

};
