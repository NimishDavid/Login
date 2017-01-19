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
            res.redirect('/admin/bugReports/unassignedBugs');
        }
        if (req.user.class == 1) {
            res.redirect('/tester/testerTasks');
        }
        if (req.user.class == 2) {
            res.redirect('/developer/bugReport');
        }
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
