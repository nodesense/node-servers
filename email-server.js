//WARNING: This is not production code, not to be used for references, best practices
// hack api to provide file upload, jwt, email featuers on top of json server
// https://github.com/typicode/json-server

// api-server.js
//RESTful API server using json-server module
//support for enable/disable cors
//support for oauth authentication
//just for angular-reactjs-workshop

const express = require("express");
const jsonServer = require('json-server')

const jwt = require('jwt-simple');
const _ = require("lodash");
const moment = require('moment');
const nodemailer = require('nodemailer');
const jsonfile = require("jsonfile");
const multer = require('multer');

const ejs = require("ejs");
const path = require("path");
var mkdirp = require('mkdirp');

mkdirp.sync("uploads")

const app = jsonServer.create()


 
const config = jsonfile.readFileSync("settings.json");
//console.log("Config ", config)
 

app.set('jwtTokenSecret', 'yX!fglBbZr');


app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
//set views directory
app.set('views', path.join(__dirname, './views'));
  

app.disable("etag");

const bodyParser = require('body-parser')
app.use(bodyParser.json());


const parseArgs = require('minimist') (process.argv.slice(2))


console.log("options ", parseArgs);

var port = parseInt(parseArgs.port) || 7090;
console.log("port ", port);
var hostname = parseInt(parseArgs.host) || 'localhost';
console.log("hostname ", hostname);

//http/https
var scheme = parseInt(parseArgs.scheme) || 'http';
console.log("scheme ", scheme);


//default 24 hrs
var expiryInMinutes = parseInt(parseArgs.expiry) || 24 * 60;

console.log("expiry in minutes ", expiryInMinutes);

var offerTime = parseInt(parseArgs.offer) || 1000;

var router = jsonServer.router('./data/emails.json')

app.get('/', function(req, res) {
    // now we pick end points from json file
    endPoints = []
    for (k in router.db.__wrapped__) {
        // console.log("K is ", k);
        endPoints.push(k)
    }

    res.render("index", {port, hostname, scheme, endPoints})
    
})

var commandLine = process.argv.join(" ").toLowerCase();
console.log("Command Line ", commandLine);

console.log(process.argv);

var defaultsOpts = {
     
}
 

if (commandLine.indexOf("nocors") >= 0) {
    defaultsOpts.noCors = true;
}

var middlewares = jsonServer.defaults(defaultsOpts)
app.use(middlewares)
    


app.use(function(req, res, next){
       if (req.url.indexOf("/delayed") > -1) {
            //delay minimum 2 - 7 seconds
            req.url = req.url.replace("/delayed", ""); 

            setTimeout(function(){
                next();      
            }, Math.floor(2 + Math.random() * 7) * 1000);
        } else {
            next();
        }
})    

app.use('/api', router)


app.post("/api/email", function(req, res) {
    console.log("Req body ", req.body);
    const email = req.body;
   
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure, // true for 465, false for other ports
        auth: {
            user: config.mail.username, // generated ethereal user
            pass: config.mail.password // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: config.mail.from, // sender address
        to: email.to, // list of receivers
        subject: email.subject, // Subject line
        text: email.message, // plain text body
        html: '<b>' + email.message + '</b>' // html body
    };

    console.log(mailOptions)

    console.log("Sending email ");
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email ", error)
             
            res.status(500).json({result: false, 
                                  error: error})
            return;
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
        res.json({
            result: true,
            msgId: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    });
 
});
 

var server = require('http').Server(app);
 

server.listen(port, function (err) {
    if (!err) {
         console.log('JSON Server is running  at ', port)
    } else {
        console.log("Error in starting REST API Server ", err);
    }
})