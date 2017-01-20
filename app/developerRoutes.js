module.exports = function (app, passport, expressValidator, connection, isLoggedIn, sendMail) {

    app.get('/developer/bugReport', isLoggedIn, function(req, res) {
        if (req.user.class == 2) {
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.file AS file, bugs.method AS method, bugs.line AS line, bugs.status AS status, bugs.developer_id AS assignedTo, projects.name AS projectName FROM bugs JOIN projects ON bugs.project_id = projects.id AND projects.status = 'Open' AND bugs.developer_id = ? AND (bugs.status = 'Assigned' OR bugs.status = 'Review' OR bugs.status = 'Resolving')", [req.user.id], function(err, bugsRes) {
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
                function updateBugStatusDeveloper() {
                    return new Promise(function(resolve, reject) {
                        var dbQuery = "UPDATE bugs SET status = ? WHERE id = ?";
                        connection.query(dbQuery, [req.body.status, req.body.bug], function(err, rows) {
                            if (err)
                                reject(err);
                            else {
                                // console.log("Database update successful");
                                resolve([req.body.status, req.body.bug]);
                            }
                        });
                    });
                }
                updateBugStatusDeveloper().then(function(params) {
                  return new Promise(function(resolve, reject) {
                    var status = params[0];
                    var bugId = params[1];
                    var dbQuery = "SELECT * FROM projects JOIN bugs WHERE bugs.id = ? AND bugs.project_id = projects.id";
                    connection.query(dbQuery, [bugId], function(err, bugsRes) {
                        if (err)
                            reject(err);
                        else {
                            resolve(bugsRes);
                        }
                    });
                  });
                }).then(function(bugsRes) {
                  return new Promise(function(resolve, reject) {
                    var dbQuery = "SELECT * FROM users WHERE id IN("+bugsRes[0].tester_id+", "+bugsRes[0].manager_id+")";
                    connection.query(dbQuery, function(err, usersRes) {
                        if (err)
                            reject(err);
                        else {
                            resolve([bugsRes, usersRes]);
                        }
                    });
                  });
                }).then(function(params) {
                  var bugsRes = params[0];
                  console.log("Params :\n");
                  console.log(params[0]);
                  console.log("Bugs :\n");
                  console.log(bugsRes);
                  var usersRes = params[1];
                  usersRes.forEach(function(item, index) {
                    var toAddress = item.email;
                    var subject = "Bug status changed!"
                    var text = "Dear "+item.name+",\n\nThe status of a bug that you are involved in has been changed recently :\n\nBug ID : "+bugsRes[0].id+"\n\nBug name : "+bugsRes[0].name+"\nBug type : "+bugsRes[0].bug_type+"\nDescription : "+bugsRes[0].description+"\nSeverity : "+bugsRes[0].severity+"\nPriority : "+bugsRes[0].priority+"\nStatus : "+bugsRes[0].status;
                    return sendMail(toAddress, subject, text);
                  });
                }).then(function(response) {
                  console.log(response);
                  res.send("Bug status changed successfully.")
                }).catch(function(err) {
                  console.log(err);
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
            connection.query("SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS rejectType, users.name AS tester, projects.name AS projectName FROM bugs JOIN users JOIN projects WHERE developer_id = ? AND (bugs.status = 'Review Reject' OR bugs.status = 'Approve Reject') AND users.id = bugs.tester_id AND bugs.project_id = projects.id AND projects.status = 'Open'", [req.user.id], function(err, rejectRes) {
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
            connection.query("SELECT bugs.id AS bugId, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.severity AS severity, bugs.priority AS priority, projects.name AS projectName, bugs.status AS status FROM bugs JOIN projects ON bugs.developer_id = ? AND bugs.status NOT IN ('Assigned', 'Resolving') AND bugs.project_id = projects.id", [req.user.id], function(err, bugsRes) {
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
