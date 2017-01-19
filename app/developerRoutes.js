module.exports = function (app, passport, expressValidator, connection, isLoggedIn, sendMail) {

    app.get('/developer/bugReport', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/developer/bugReport', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            req.assert('status').notEmpty().isIn(['Resolving', 'Review']);
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/developer/rejectedBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/developer/bugHistory', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

};
