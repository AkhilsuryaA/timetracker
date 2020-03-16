
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');
var mysql = require("mysql");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;

var nodemailer = require('nodemailer');
const creds = require('../config/config');

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            console.log("working")
            callback(null, html);
        }
    });
};

var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');    
  }
});

var htmlToSend;

const send = (req,res,next) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {                //C:/Users/Weboffice PC 2/React/timetracker/app_frontend/public/template/template.html
            var from = req.body.from
            var to = req.body.to
            let workspace_id = req.body.workspace_id;
            let teamLink = "http://localhost:3000/Signupform?q="+workspace_id;
            readHTMLFile('../timetracker/app_frontend/public/template/template.html', function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    username: to,
                    sender:from,
                    team_link:teamLink
                };
                htmlToSend = template(replacements);
                var mail = {
                    from: transport.auth.user,
                    to: to,  //Change to email address that you want to receive messages on
                    subject: `New Message from ${from}`,
                    html:htmlToSend
                }
                  
                transporter.sendMail(mail, (err, data) => {
                    if (err) {
                        res.json({
                            msg: 'fail'
                        })
                    } else {
                        res.json({
                            msg: 'success'
                        })
                    }
                })  
            });
        }
    });
}

module.exports = send;

