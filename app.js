var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var constant = require('./constant');
var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


router.get("/",(req,res)=>{
  res.render('header', {baseUrl:constant.baseUrl });
})


app.set('port', process.env.PORT || constant.PORT);
app.use('/', router);

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