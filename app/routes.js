module.exports = function(app, passport, expressValidator) {
    var async = require('async');
    var dbconfig = require('../config/database');
    var mysql = require('mysql');
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
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
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
        var dbQuery = "SELECT users.id AS devID, users.name AS devName, projects.id AS projectId, projects.name AS projectName FROM project_team JOIN projects JOIN users ON project_team.user_id = users.id AND project_team.project_id = ? AND projects.id = project_team.project_id AND users.class = 2";
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
        var dbQuery = "SELECT users.id AS testerID, users.name AS testerName, projects.name AS projectName, projects.id AS projectId FROM project_team JOIN users JOIN projects ON project_team.user_id = users.id AND project_team.project_id = ? AND projects.id = project_team.project_id AND users.class = 1";
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
        var dbQuery = "SELECT DISTINCT(users.id) AS testerId, users.name AS testerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 1 AND projects.id != ? WHERE users.id NOT IN (SELECT DISTINCT(users.id) FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 1 AND projects.id = ?) GROUP BY users.id";
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
        var dbQuery = "SELECT DISTINCT(users.id) AS developerId, users.name AS developerName, projects.id AS projectId FROM users JOIN project_team JOIN projects ON projects.id = project_team.project_id AND users.class = 2 AND projects.id != ? WHERE users.id NOT IN (SELECT DISTINCT(users.id) FROM projects JOIN project_team JOIN users ON project_team.user_id = users.id AND projects.id = project_team.project_id AND users.class = 2 AND projects.id = ?) GROUP BY users.id";
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
