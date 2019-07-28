var config = require('../constant')['DATABASE'];
var databaseUrl;

databaseUrl = "mongodb://"  + config.host + ":" + config.port + "/" + config.dbname;

var collections = ["users"];
console.log("databaseUrl-------------->"+databaseUrl)
var db = require("mongojs")(databaseUrl, collections);

//TODO in app.js route
// var user={
//     name : "rohit"
// }
// db.users.insert(user);


var DB={db:db};


module.exports = DB;