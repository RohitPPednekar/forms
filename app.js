var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');
var expressValidator = require('express-validator');
var constant = require('./constant');
var index = require('./route/index');

var db = require('./utils/db');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/",index);
app.set('port', process.env.PORT || constant.PORT);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handling
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.status);
  res.render('error', {
      message: err.message,
      data : {baseUrl : constant.baseUrl, statusCode : err.status || 500},
  });
});


var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });


  module.exports = app;