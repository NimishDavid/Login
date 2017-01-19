module.exports.sendMail = function(toAddress, subject, mailContent) {
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
            text: mailContent //, // plaintext body
            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
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
