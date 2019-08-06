var config = require('../constant')['DATABASE'];
var databaseUrl;

databaseUrl = process.env.MONGODB_URI || "mongodb://"  + config.host + ":" + config.port + "/" + config.dbname;

var collections = ["users"];

var db = require("mongojs")(databaseUrl, collections);


var DB={db:db};


module.exports = DB;