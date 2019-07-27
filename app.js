var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('port', process.env.PORT || 5000);


var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });


  module.exports = app;