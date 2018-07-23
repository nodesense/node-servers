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
const jsonfile = require("jsonfile");
const multer = require('multer');

const ejs = require("ejs");
const path = require("path");
var mkdirp = require('mkdirp');

mkdirp.sync("uploads")

const app = jsonServer.create()

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log("FIle ", file)
     cb(null,  Date.now() + "-" + file.originalname)
     //cb(null, file.fieldname)
    }
});

var upload = multer({storage: storage});
var serveIndex = require('serve-index')


app.use('/uploads', express.static('uploads'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));


 
  
app.disable("etag");

const bodyParser = require('body-parser')
app.use(bodyParser.json());


const parseArgs = require('minimist') (process.argv.slice(2))


console.log("options ", parseArgs);

var port = parseInt(parseArgs.port) || 7080;
console.log("port ", port);
var hostname = parseInt(parseArgs.host) || 'localhost';
console.log("hostname ", hostname);

//http/https
var scheme = parseInt(parseArgs.scheme) || 'http';
console.log("scheme ", scheme);

 
var offerTime = parseInt(parseArgs.offer) || 1000;
 
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
 
var server = require('http').Server(app);

server.listen(port, function (err) {
    if (!err) {
         console.log('JSON Server is running  at ', port)
    } else {
        console.log("Error in starting REST API Server ", err);
    }
})