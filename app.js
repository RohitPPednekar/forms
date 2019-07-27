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

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });


  module.exports = app;