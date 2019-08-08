const MongoClient = require('mongodb').MongoClient;
const constant = require("../constant");

function dbConnection(){
  
  
  const uri =  constant.NetworkMongoConnectionUrl;
  
  return new Promise((resolve,reject)=>{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    client.connect(err => {
      var mongodb;
      mongodb = client.db("forms");  
    
    resolve({mongoConnectionObj:mongodb,mongoConnection :client });

  });
});
}

module.exports = {connection : dbConnection};