module.exports = function (app, passport, expressValidator, connection, isLoggedIn, sendMail) {
var nodemailer = require('nodemailer');
// mailer = require('./mailer.js');

    app.get('/admin/bugReports/unassignedBugs', isLoggedIn, function(req, res) {

        if (req.user.class == 0) {

            getBugsAdminUnassigned(req).then(function(bugsRes) {
                    return new Promise(function(resolve, reject) {
                        var dbQuery = "SELECT project_team.user_id AS devID, users.name AS devName FROM projects JOIN project_team JOIN users ON projects.manager_id = ? AND projects.id = project_team.project_id AND project_team.user_id = users.id AND users.class = 2 AND projects.status = 'Open'";
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
                res.send("Bug assigned to developer");
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

    app.get('/admin/approveBugs', isLoggedIn, function(req, res) {
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
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/admin/approveBugs', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('status').notEmpty().isIn(['Approve Reject', 'Closed']);
            req.assert('bug').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                function updateBugStatusAdmin() {
                  return new Promise(function(resolve, reject) {
                    var dbQuery = "UPDATE bugs SET status = '" + req.body.status + "' WHERE id = " + req.body.bug;
                    connection.query(dbQuery, function(err, devRes) {
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
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

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

    app.post('/admin/manageProjectTeam/manageTesters/addTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('testers').notEmpty();
            req.assert('project_id').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
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
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

    app.post('/admin/manageProjectTeam/manageTesters/removeTesters', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('user_id').notEmpty().isInt();
            req.assert('project_id').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                dbQuery = "DELETE FROM project_team WHERE user_id = ? AND project_id = ?";
                connection.query(dbQuery, [req.body.user_id, req.body.project_id], function(err, rows) {
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
                console.log("Invalid input");
                res.end("Invalid input");
            }
        } else {
            console.log("Forbidden access");
            res.end("Forbidden access");
        }
    });

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

    app.post('/admin/manageProjectTeam/manageDevelopers/removeDevelopers', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('user_id').notEmpty().isInt();
            req.assert('project_id').notEmpty().isInt();
            var errors = req.validationErrors();
            if (!errors) {
                console.log("No validation errors!");
                dbQuery = "DELETE FROM project_team WHERE user_id = ? AND project_id = ?";
                connection.query(dbQuery, [req.body.user_id, req.body.project_id], function(err, rows) {
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

    app.post('/admin/manageProjects/addProjects', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            req.assert('project_name').notEmpty();
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

    function getBugsAdminUnassigned(req) {

        return new Promise(function(resolve, reject) {

            connection.query("SELECT DISTINCT(bugs.id) AS bugID, project_team.project_id AS projectID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS status, bugs.developer_id AS assignedTo FROM projects JOIN project_team JOIN bugs WHERE projects.manager_id = ? AND project_team.project_id = bugs.project_id AND bugs.project_id = projects.id AND projects.status = 'Open' ORDER BY bugs.id DESC", [req.user.id], function(err, bugsRes) {
                if (err)
                    reject(err);
                else {
                    resolve(bugsRes);
                }
            });

        });

    }

    function getBugsAdmin(req) {

        return new Promise(function(resolve, reject) {

            connection.query("SELECT DISTINCT(bugs.id) AS bugID, project_team.project_id AS projectID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.severity AS severity, bugs.priority AS priority, bugs.status AS status, bugs.developer_id AS assignedTo, users.name AS assignedToName FROM projects JOIN project_team JOIN bugs JOIN users WHERE projects.manager_id = ? AND project_team.project_id = bugs.project_id AND bugs.project_id = projects.id AND projects.status = 'Open' AND bugs.developer_id = users.id ORDER BY bugs.id DESC", [req.user.id], function(err, bugsRes) {
                if (err)
                    reject(err);
                else {
                    resolve(bugsRes);
                }
            });

        });

    }

    function getTestersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS testerId, users.name AS testerName, projects.id AS projectId, projects.name AS projectName FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id = ? AND projects.status = 'Open'";
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
            var dbQuery2 = "SELECT DISTINCT(users.id) AS testerId, users.name AS testerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 1 AND projects.manager_id != ? AND projects.status = 'Open'";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, testResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, testResRem, testResAdd]);
                }
            });
        });
    }

    function getDevelopersRem(req, projectsRes) {
        return new Promise(function(resolve, reject) {
            var dbQuery1 = "SELECT users.id AS developerId, users.name AS developerName, projects.id AS projectId, projects.name AS projectName FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id = ? AND projects.status = 'Open'";
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
            var dbQuery2 = "SELECT DISTINCT(users.id) AS developerId, users.name AS developerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 2 AND projects.manager_id != ? AND projects.status = 'Open'";
            connection.query(dbQuery2, [req.user.id, req.user.id], function(err, devResAdd) {
                if (err) {
                    reject(err);
                } else {
                    resolve([projectsRes, devResRem, devResAdd]);
                }
            });
        });
    }

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
