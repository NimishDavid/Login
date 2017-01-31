module.exports = function (app, passport, expressValidator, connection, isLoggedIn, sendMail) {
var nodemailer = require('nodemailer');
var md5 = require('md5');
// mailer = require('./mailer.js');

    app.get('/admin/bugReports/overview', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          getProjectsManage(req).then(function(projectsRes) {
            res.render('overview.ejs', {
              user: req.user,
              proj: projectsRes
            });
          }).catch(function(err) {
              console.log(err);
          });
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get list of unassigned bugs
    app.get('/admin/bugReports/unassignedBugs', isLoggedIn, function(req, res) {

        if (req.user.class == 0) {

            getBugsAdminUnassigned(req).then(function(bugsRes) {
                    return new Promise(function(resolve, reject) {
                        var dbQuery = "SELECT project_team.user_id AS devID, users.name AS devName, projects.id AS projectId FROM projects JOIN project_team JOIN users ON projects.manager_id = ? AND projects.id = project_team.project_id AND project_team.user_id = users.id AND users.class = 2 AND projects.status = 'Open'";
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }

    });

    // Assign bug to a developer
    app.post('/admin/bugReports/unassignedBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('dev').notEmpty().isInt();
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                function assignBug() {
                    return new Promise(function(resolve, reject) {
                        var dbQuery = "UPDATE bugs SET developer_id = ?, status = 'Assigned' WHERE id = ?";
                        connection.query(dbQuery, [req.body.dev, req.body.bug], function(err, devRes) {
                            if (err)
                                reject(err);
                            else {
                                res.send("Bug assigned to developer");
                                resolve([req.body.dev, req.body.bug]);
                            }
                        });
                    });
                }
                assignBug().then(function(params) {
                    return new Promise(function(resolve, reject) {
                        var devID = params[0];
                        var bugID = params[1];
                        var dbQuery = "SELECT bugs.id AS bugid, bugs.name AS bugname, bugs.bug_type AS bugtype, bugs.description AS description, bugs.priority AS priority, bugs.severity as severity, users.name AS assignedto, bugs.status AS status, users.email AS email FROM bugs JOIN users ON bugs.developer_id = users.id AND users.id = ? AND bugs.id = ?";
                        connection.query(dbQuery, [devID, bugID], function(err, emailRes) {
                            if (err)
                                reject(err);
                            else {
                                resolve(emailRes);
                            }
                        });
                    });
            }).then(function(emailRes) {
                    var toAddress = emailRes[0].email;
                    var subject = "New bug assigned!"
                    var text = "Dear "+emailRes[0].assignedto+",\n\nA new bug has been assigned to you :\n\nBug name : "+emailRes[0].bugname+"\nBug type : "+emailRes[0].bugtype+"\nDescription : "+emailRes[0].description+"\nSeverity : "+emailRes[0].severity+"\nPriority : "+emailRes[0].priority+"\nStatus : "+emailRes[0].status;
                    return sendMail(toAddress, subject, text);
            }).then(function(response) {
                console.log(response);
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

    // Get list of assigned bugs
    app.get('/admin/bugReports/assignedBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get list of closed bugs
    app.get('/admin/bugReports/closedBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get list of resolved bugs pending approval
    app.get('/admin/approveBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            connection.query("SELECT bugs.id AS bugid, bugs.name AS bugname, bugs.bug_type AS bugtype, bugs.description AS description, bugs.priority AS priority, bugs.severity as severity, users.name AS assignedto, bugs.status AS status, projects.name AS projectName FROM projects JOIN bugs JOIN users ON bugs.project_id = projects.id AND projects.manager_id = ? AND bugs.developer_id = users.id AND bugs.status = 'Approval' AND projects.status = 'Open' ORDER BY bugs.id DESC", [req.user.id], function(err, bugsRes) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Update the status of bugs pending approval
    app.post('/admin/approveBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          if(typeof(req.body.reason) != 'undefined') {
            req.assert('status').notEmpty().isIn(['Approve Reject', 'Closed']);
            req.assert('bug').notEmpty().isInt();
            req.assert('reason').notEmpty();
            var errors = req.validationErrors();
            if (!errors) {
                function updateBugStatusAdmin() {
                  return new Promise(function(resolve, reject) {
                    var dbQuery = "UPDATE bugs SET status = ?, reject_reason = ? WHERE id = ?";
                    connection.query(dbQuery, [req.body.status, req.body.reason, req.body.bug], function(err, devRes) {
                        if (err)
                            reject(err);
                        else {
                            resolve([req.body.status, req.body.bug]);
                        }
                    });
                  });
                }
                updateBugStatusAdmin().then(function(params) {
                  return new Promise(function(resolve, reject) {
                    var status = params[0];
                    var bugId = params[1];
                    var dbQuery = "SELECT * FROM bugs WHERE id = ?";
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
                    var dbQuery = "SELECT * FROM users WHERE id IN("+bugsRes[0].developer_id+", "+bugsRes[0].tester_id+")";
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
                  var usersRes = params[1];
                  usersRes.forEach(function(item, index) {
                    var toAddress = item.email;
                    var subject = "Bug status changed!"
                    var text = "Dear "+item.name+",\n\nThe status of a bug that you are involved in has been changed recently :\n\nBug ID : "+bugsRes[0].id+"\n\nBug name : "+bugsRes[0].name+"\nBug type : "+bugsRes[0].bug_type+"\nDescription : "+bugsRes[0].description+"\nSeverity : "+bugsRes[0].severity+"\nPriority : "+bugsRes[0].priority+"\nStatus : "+bugsRes[0].status+"\nReject Reason : "+bugsRes[0].reject_reason;
                    return sendMail(toAddress, subject, text);
                  });
                }).then(function(response) {
                  console.log(response);
                  res.send("Bug status changed successfully.")
                }).catch(function(err) {
                  console.log(err);
                })
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
          }
          else {
            req.assert('status').notEmpty().isIn(['Approve Reject', 'Closed']);
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                function updateBugStatusAdmin() {
                  return new Promise(function(resolve, reject) {
                    var dbQuery = "UPDATE bugs SET status = ? WHERE id = ?";
                    connection.query(dbQuery, [req.body.status, req.body.bug], function(err, devRes) {
                        if (err)
                            reject(err);
                        else {
                            resolve([req.body.status, req.body.bug]);
                        }
                    });
                  });
                }
                updateBugStatusAdmin().then(function(params) {
                  return new Promise(function(resolve, reject) {
                    var status = params[0];
                    var bugId = params[1];
                    var dbQuery = "SELECT * FROM bugs WHERE id = ?";
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
                    var dbQuery = "SELECT * FROM users WHERE id IN("+bugsRes[0].developer_id+", "+bugsRes[0].tester_id+")";
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
                })
            } else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
          }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get a list of testers who are already in the team and another list of testers who are not part of the team
    app.get('/admin/manageProjectTeam/manageTesters', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Add selected testers into the team
    app.post('/admin/manageProjectTeam/manageTesters/addTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('testers').notEmpty();
            req.assert('project_id').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                var vals = "";
                console.log(req.body.testers);
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
                            var t = "";
                            req.body.testers.forEach(function(item, index) {
                                t += item+", ";
                            });
                            t = t.slice(0, -2);
                            var dbQuery = "SELECT users.name AS testerName, projects.name AS projectName, users.email AS email, projects.id AS projectId FROM users JOIN project_team JOIN projects ON users.id IN("+ t +") AND project_team.user_id = users.id AND projects.id = project_team.project_id AND projects.id = ?";
                            connection.query(dbQuery, req.body.project_id, function(err, usersRes) {
                                if (err)
                                    console.log(err);
                                else {
                                    usersRes.forEach(function(item, index) {
                                      var toAddress = item.email;
                                      var subject = "New task for you!"
                                      var text = "Dear "+item.testerName+",\n\nA new project has been assigned to you for testing :\n\nProject ID : "+item.projectId+"\n\nProject name : "+item.projectName;
                                      return sendMail(toAddress, subject, text);
                                    });
                                }
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
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

    // Remove selected testers from the existing team
    app.post('/admin/manageProjectTeam/manageTesters/removeTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('testers').notEmpty();
            req.assert('projectTester').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                var t = "";
                req.body.testers.forEach(function(item, index) {
     	            t += item+", ";
                });
                t = t.slice(0, -2);
                dbQuery = "DELETE FROM project_team WHERE user_id IN ("+ t +") AND project_id = ?";
                connection.query(dbQuery, [req.body.projectTester], function(err, rows) {
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
                                msg: "failRem"
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
                                msg: "successRem"
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
            }
            else {
                console.log(errors);
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get a list of developers in the existing team and another list of develpers who are not in the team
    app.get('/admin/manageProjectTeam/manageDevelopers', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Add selected developers in to the team.
    app.post('/admin/manageProjectTeam/manageDevelopers/addDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('developers').notEmpty();
            req.assert('project_id').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
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
                            var t = "";
                            req.body.developers.forEach(function(item, index) {
                                t += item+", ";
                            });
                            t = t.slice(0, -2);
                            var dbQuery = "SELECT users.name AS developerName, projects.name AS projectName, users.email AS email, projects.id AS projectId FROM users JOIN project_team JOIN projects ON users.id IN("+ t +") AND project_team.user_id = users.id AND projects.id = project_team.project_id AND projects.id = ?";
                            connection.query(dbQuery, req.body.project_id, function(err, usersRes) {
                                if (err)
                                    console.log(err);
                                else {
                                    usersRes.forEach(function(item, index) {
                                      var toAddress = item.email;
                                      var subject = "New project!"
                                      var text = "Dear "+item.developerName+",\n\nYou have been added to a new project :\n\nProject ID : "+item.projectId+"\n\nProject name : "+item.projectName;
                                      return sendMail(toAddress, subject, text);
                                    });
                                }
                            });
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
                });
            }
            else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Remove selected devlopers from the team
    app.post('/admin/manageProjectTeam/manageDevelopers/removeDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('developers').notEmpty();
            req.assert('projectDeveloper').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                var t = "";
                req.body.developers.forEach(function(item, index) {
     	            t += item+", ";
                });
                t = t.slice(0, -2);
                dbQuery = "DELETE FROM project_team WHERE user_id IN ("+ t +") AND project_id = ?";
                connection.query(dbQuery, [req.body.projectDeveloper], function(err, rows) {
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
            }
            else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get list of projects managed by the admin
    app.get('/admin/manageProjects', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Add a new project
    app.post('/admin/manageProjects/addProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('project_name').notEmpty().matches(/^[a-zA-Z0-9\s]+$/);
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
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
            }
            else {
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Remove an existing project
    app.post('/admin/manageProjects/removeProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('projects').notEmpty();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
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
          }
          else {
              console.log("Invalid input");
              res.end("Invalid input");
          }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/admin/manageUsers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
          var dbQuery = "SELECT * FROM users WHERE flag = 1";
          connection.query(dbQuery, function(err, usersResult) {
              if (err)
                  console.log(err);
              else {
                res.render('manageUsers.ejs', {
                    user: req.user,
                    users: usersResult
                });
              }
          });
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/admin/manageUsers/addUser', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('name').notEmpty().matches(/^[a-zA-Z\s]+$/);
            req.assert('employee_id').notEmpty().isInt().isLength(3);
            req.assert('employee_type').notEmpty().isInt();
            req.assert('email').notEmpty().isEmail();
            req.assert('password').notEmpty().isLength(6,50);
            req.assert('passwordre').notEmpty();
            var errors = req.validationErrors();
            if (!errors) {
                function addUserAdmin() {
                  return new Promise(function(resolve, reject) {
                    var dbQuery = "INSERT INTO users (employee_id, password, class, name, email) VALUES (?, ?, ?, ?, ?)";
                    connection.query(dbQuery, [req.body.employee_id, md5(req.body.password), req.body.employee_type, req.body.name, req.body.email], function(err, devRes) {
                        if (err)
                            reject(err);
                        else {
                            resolve();
                        }
                    });
                  });
                }
                addUserAdmin().then(function() {
                    res.render('manageUsers.ejs', {
                        msg: "successAdd",
                        user: req.user
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.render('manageUsers.ejs', {
                        msg: "failAdd",
                        user: req.user
                    });
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

    app.post('/admin/manageUsers/removeUsers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('users').notEmpty();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                var t = "";
                req.body.users.forEach(function(item, index) {
     	            t += item+", ";
                });
                t = t.slice(0, -2);
                dbQuery = "UPDATE users SET flag = '0' WHERE id IN ("+ t +")";
                connection.query(dbQuery, function(err, rows) {
                    if (err) {
                      var dbQuery = "SELECT * FROM users WHERE flag = 1";
                      connection.query(dbQuery, function(err, usersResult) {
                          if (err)
                              console.log(err);
                          else {
                            res.render('manageUsers.ejs', {
                                user: req.user,
                                users: usersResult,
                                msg: "failRem"
                            });
                          }
                      });
                    } else {
                      var dbQuery = "SELECT * FROM users WHERE flag = 1";
                      connection.query(dbQuery, function(err, usersResult) {
                          if (err)
                              console.log(err);
                          else {
                            res.render('manageUsers.ejs', {
                                user: req.user,
                                users: usersResult,
                                msg: "successRem"
                            });
                          }
                      });
                    }
                });
            }
            else {
                console.log(errors);
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.get('/admin/checkUser', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            var empId = req.query.employee_id;
            var dbQuery = "SELECT * FROM users WHERE employee_id = ?";
            connection.query(dbQuery, [empId], function(err, userCheckRes) {
                if (err)
                    res.end(err);
                else {
                    if(userCheckRes.length != 0) {
                        res.writeHead(400, 'EmpID already exists!');
                        res.send();
                    }
                    else {
                        res.sendStatus(200);
                    }
                }
            });
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    // Get the list of unassigned bugs
    function getBugsAdminUnassigned(req) {

        return new Promise(function(resolve, reject) {

            connection.query("SELECT DISTINCT(bugs.id) AS bugID, project_team.project_id AS projectID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS status, bugs.developer_id AS assignedTo, projects.name AS projectName FROM projects JOIN project_team JOIN bugs WHERE projects.manager_id = ? AND project_team.project_id = bugs.project_id AND bugs.project_id = projects.id AND projects.status = 'Open' ORDER BY bugs.id DESC", [req.user.id], function(err, bugsRes) {
                if (err)
                    reject(err);
                else {
                    resolve(bugsRes);
                }
            });

        });

    }

    // Get list of bugs in the projects managed by the admin.
    function getBugsAdmin(req) {

        return new Promise(function(resolve, reject) {

            connection.query("SELECT DISTINCT(bugs.id) AS bugID, project_team.project_id AS projectID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS status, bugs.developer_id AS assignedTo, users.name AS assignedToName, projects.name AS projectName FROM projects JOIN project_team JOIN bugs JOIN users WHERE projects.manager_id = ? AND project_team.project_id = bugs.project_id AND bugs.project_id = projects.id AND projects.status = 'Open' AND bugs.developer_id = users.id ORDER BY bugs.id DESC", [req.user.id], function(err, bugsRes) {
                if (err)
                    reject(err);
                else {
                    resolve(bugsRes);
                }
            });

        });

    }

    // Get list of testers in the existing project team
    function getTestersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS testerId, users.name AS testerName, projects.id AS projectId, projects.name AS projectName FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id = ? AND projects.status = 'Open' AND users.flag = 1";
            connection.query(dbQuery1, [req.user.id], function(err, testResRem) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, testResRem]);
                }
            });
        });
    }

    // Get list of testers who are not yet in at least one of the projects managed by the admin
    function getTestersAdd(req, projectsRes, testResRem) {
        return new Promise(function(resolve, reject) {
            var dbQuery2 = "SELECT DISTINCT(users.id) AS testerId, users.name AS testerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id != ? AND projects.status = 'Open' AND users.flag = 1";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, testResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, testResRem, testResAdd]);
                }
            });
        });
    }

    // Get list of developers who are in the existing project team
    function getDevelopersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS developerId, users.name AS developerName, projects.id AS projectId, projects.name AS projectName FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id = ? AND projects.status = 'Open' AND users.flag = 1";
            connection.query(dbQuery1, [req.user.id], function(err, devResRem) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, devResRem]);
                }
            });
        });
    }

    // Get list of developers who are not in at least one of the projects managed by the admin
    function getDevelopersAdd(req, projectsRes, devResRem) {
        return new Promise(function(resolve, reject) {
            var dbQuery2 = "SELECT DISTINCT(users.id) AS developerId, users.name AS developerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id != ? AND projects.status = 'Open' AND users.flag = 1";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, devResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, devResRem, devResAdd]);
                }
            });
        });
    }

    // Get the list of projects managed by the admin
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

};
