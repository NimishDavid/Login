module.exports = function(app, passport, expressValidator) {
    var async = require('async');
    var dbconfig = require('../config/database');
    var mysql = require('mysql');
    var random = require('randomstring');
    var md5 = require('md5');
    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);
    var nodemailer = require('nodemailer');
    // Index page
    app.get('/', function(req, res) {
        res.redirect('/login');
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
                req.session.cookie.maxAge = 1000 * 60 * 60;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
    });

    app.get('/forgotPassword', function(req, res) {

        // Render the page and pass in any flash data if it exists
        res.render('forgotPassword.ejs', {
        });
    });

    app.post('/forgotPassword', function(req, res) {
      req.assert('username').notEmpty().isLength(3).isInt();
      req.assert('email').notEmpty().isEmail();
      var errors = req.validationErrors();
      if( !errors) {
        console.log("No validation errors");
        connection.query("SELECT * FROM users WHERE employee_id = ? AND email = ?",[req.body.username, req.body.email], function(err, rows){
            if (err)
                console.log(err);
            else {
              if (!rows.length) {
                res.render('forgotPassword.ejs', {
                  message: "fail"
                });
              }
              else {
                var reqID = random.generate({ length:10, charset:'alphabetic'});
                connection.query("INSERT INTO password_change_requests (request_id, employee_id) VALUES (?, ?)",[md5(reqID), req.body.username], function(err, rows){
                    if (err)
                        console.log(err);
                    else {
                      var subject = "Bug Tracker : Reset Password"
                      var content = "Please click the link below to reset your password :\nhttp://192.168.1.233:8000/resetPassword/"+reqID;
                      sendMail(req.body.email, subject, content);
                      res.render('forgotPassword.ejs', {
                        message: "success"
                      });
                    }
                });
              }
            }
        });
      }
      else {
        console.log("Invalid input");
        res.end("Invalid input");
      }
    });

    app.get('/resetPassword/:params', function(req, res) {
      var dbQuery = "SELECT * FROM password_change_requests WHERE request_id = ? AND flag = 1";
      console.log(req.body.bug);
      connection.query(dbQuery, [md5(req.params.params)], function(err, rows) {
          if (err)
              console.log(err);
          else {
              if(!rows.length) {
                res.end("Invalid link");
              }
              else {
                console.log(rows[0].time);
                res.render('resetPassword.ejs', {
                  reqID: req.params.params
                });
              }
          }
      });
    });

    app.post('/resetPassword', function(req, res) {
      req.assert('password').notEmpty().isLength(6,50);
      req.assert('passwordre').notEmpty();
      req.assert('req_id').notEmpty();
      var errors = req.validationErrors();
      if (!errors) {
          function getEmployee() {
            return new Promise(function(resolve, reject) {
              var dbQuery = "SELECT * FROM password_change_requests WHERE request_id = ?";
              connection.query(dbQuery, [md5(req.body.req_id)], function(err, rows) {
                  if (err)
                      reject(err);
                  else {
                      if(!rows.length) {
                        reject("Invalid link");
                      }
                      else {
                        resolve([rows[0].employee_id, md5(req.body.req_id)]);
                      }
                  }
              });
            });
          }
          getEmployee().then(function(params) {
            return new Promise(function(resolve, reject) {
              var empID = params[0];
              var reqID = params[1];
              var dbQuery = "UPDATE users SET password = ? WHERE employee_id = ?";
              connection.query(dbQuery, [md5(req.body.password), empID], function(err, devRes) {
                  if (err)
                      reject(err);
                  else {
                    resolve([empID, reqID]);
                  }
              });
            });
          }).then(function(params) {
            return new Promise(function(resolve, reject) {
              var dbQuery = "UPDATE password_change_requests SET flag = 0 WHERE request_id = ?";
              connection.query(dbQuery, [params[1]], function(err, devRes) {
                  if (err)
                      reject(err);
                  else {
                    res.render('resetPassword.ejs', {
                      message: "success"
                    });
                  }
              });
            });
          }).catch(function(err) {
              console.log(err);
              res.end(err);
          });
      } else {
          console.log("Invalid input");
          res.end("Invalid input");
      }
    });

    // Home page. Login verified using isLoggedIn.
    app.get('/home', isLoggedIn, function(req, res) {
        if (req.user.class == 0) {
            res.redirect('/admin/bugReports/overview');
        }
        if (req.user.class == 1) {
            res.redirect('/tester/testerTasks');
        }
        if (req.user.class == 2) {
            res.redirect('/developer/bugReport');
        }
    });

    app.post('/getBugDetails', isLoggedIn, function(req, res) {
        var dbQuery = "SELECT bugs.id AS bugID, bugs.name AS bugName, bugs.bug_type AS bugType, bugs.description AS description, bugs.file AS file, bugs.method AS method, bugs.line AS line, bugs.priority AS priority, bugs.severity AS severity, bugs.status AS status, projects.name AS projectName, users.name AS userName, bugs.screenshot AS screenshot, bugs.reject_reason AS reason, projects.id AS projectId, bugs.date AS date FROM bugs JOIN projects JOIN users ON bugs.id = ? AND projects.id = bugs.project_id AND (bugs.tester_id = users.id OR bugs.developer_id = users.id OR projects.manager_id = users.id) ORDER BY users.class";
        console.log(req.body.bug);
        connection.query(dbQuery, req.body.bug, function(err, bugsRes) {
            if (err)
                res.send(err);
            else {
                console.log(bugsRes);
                res.send(bugsRes);
            }
        });
    });

    app.post('/getDevs', isLoggedIn, function(req, res) {
        console.log('getDevs entered');
        var dbQuery = "SELECT users.id AS devID, users.name AS devName, projects.id AS projectId, projects.name AS projectName FROM project_team JOIN projects JOIN users ON project_team.user_id = users.id AND project_team.project_id = ? AND projects.id = project_team.project_id AND users.class = 2 AND users.flag = 1";
        console.log(req.body.proj);
        connection.query(dbQuery, [req.body.proj], function(err, devResult) {
            if (err)
                res.send(err);
            else {
                console.log(devResult);
                res.send(devResult);
            }
        });
    });

    app.post('/getBugsProject', isLoggedIn, function(req, res) {

      connection.query("SELECT * FROM bugs WHERE project_id = ?", [req.body.proj], function(err, bugsProjectResult) {
          if (err)
              res.send(err);
          else {
              console.log(bugsProjectResult);
              res.send(bugsProjectResult);
          }
      });

    });

    app.post('/getTesters', isLoggedIn, function(req, res) {
        console.log('getTesters entered');
        var dbQuery = "SELECT users.id AS testerID, users.name AS testerName, projects.name AS projectName, projects.id AS projectId FROM project_team JOIN users JOIN projects ON project_team.user_id = users.id AND project_team.project_id = ? AND projects.id = project_team.project_id AND users.class = 1 AND users.flag = 1";
        connection.query(dbQuery, [req.body.proj], function(err, testerResult) {
            if (err)
                res.send(err);
            else {
                console.log(testerResult);
                res.send(testerResult);
            }
        });
    });

    app.post('/getTestersAdd', isLoggedIn, function(req, res) {
        console.log('getTesters entered');
        var dbQuery = "SELECT DISTINCT(users.id) AS testerId, users.name AS testerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 1 AND projects.id != ? AND users.flag = 1 WHERE users.id NOT IN (SELECT DISTINCT(users.id) FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.id = ?) GROUP BY users.id";
        console.log(req.body.proj);
        connection.query(dbQuery, [req.body.proj, req.body.proj], function(err, testerResult) {
            if (err)
                res.send(err);
            else {
                console.log(testerResult);
                res.send(testerResult);
            }
        });
    });

    app.post('/getDevelopersAdd', isLoggedIn, function(req, res) {
        console.log('getDevelopers entered');
        var dbQuery = "SELECT DISTINCT(users.id) AS developerId, users.name AS developerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 2 AND projects.id != ? AND users.flag = 1 WHERE users.id NOT IN (SELECT DISTINCT(users.id) FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.id = ?) GROUP BY users.id";
        console.log(req.body.proj);
        connection.query(dbQuery, [req.body.proj, req.body.proj], function(err, developerResult) {
            if (err)
                res.send(err);
            else {
                console.log(developerResult);
                res.send(developerResult);
            }
        });
    });

    // Admin routes
    require('./adminRoutes.js')(app, passport, expressValidator, connection, isLoggedIn, sendMail);

    // Tester routes
    require('./testerRoutes.js')(app, passport, expressValidator, connection, isLoggedIn, sendMail);

    // Developer routes
    require('./developerRoutes.js')(app, passport, expressValidator, connection, isLoggedIn, sendMail);



    function sendMail(toAddress, subject, mailContent) {
        return new Promise(function(resolve, reject) {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'bugtrackerndm@gmail.com', // Your email id
                    pass: 'bugtracker' // Your password
                }
            }, function(err) {
                reject(err);
            });

            var mailOptions = {
                from: 'bugtrackerndm@gmail.com', // sender address
                to: toAddress, // list of receivers
                subject: subject, // Subject line
                text: mailContent // plaintext body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    reject(error);
                }else{
                    console.log('Message sent: ' + info.response);
                    resolve(info.response);
                };
            });
        });
    }

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
