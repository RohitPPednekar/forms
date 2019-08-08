var express = require("express");
var path = require('path');
var root_path = path.dirname(require.main.filename);
var bodyParser = require('body-parser');
var multer  = require('multer');
var constant = require('../constant');
var router  = express.Router();
var upload = multer({
	dest: root_path + constant.UploadPath
});
const MongoDatabase = require('../utils/db');


/** 
 * Input :- None
 * Output :- File rendered
 * Description :- Get route for main url for rendering the form page
*/
router.get("/",async (req,res)=>{
  try{
    const data = await MongoDatabase.connection();
    data.mongoConnectionObj.collection('users').find().toArray(function(err, users) {
      
      res.render('header', {baseUrl:constant.baseUrl,visits : users.length });  
    });
    data.mongoConnection.close();
    
  }catch(error){
    var err = new Error('Connection Error, Please try after some time !');
    err.status = 501;
  };
  
    
})
  
  /** 
   * Input :- Body parameter(Name, Email, jobTitle, phoneNumber, resume)
   * Output :- JSON Object
   * Description :- POST route for inserting the form data in the DB and uploading the resume file in the directory
  */
  router.post("/",upload.single('resume'),async (req,res)=>{
      
      if(req.file.size > constant.MaxSize) {
        require('fs').unlink(req.file.path);
          res.json({
            status: 400,
            message: "Max file size exceeded. Max file size allowed is 1mb!",
          });
      }else {
        if(req.file) {
          console.log("----------------1-----------------")
          var imgArr = req.file.originalname.split('.');
                  var format = imgArr[imgArr.length - 1].trim();
                  if(format == 'pdf' || format == 'docs' || format == 'doc' || format == 'docx') {					
                      
                      var fs = require('fs');
            var mkdirp = require('mkdirp');
            var shortidFolder = require('shortid').generate();
            console.log("----------------2-----------------")
                  var uploadResume = new Promise((resolve,reject)=>{
                    console.log("----------------3-----------------")
                      //Make id folder in the upload directory
                      mkdirp(root_path+constant.UploadPath+shortidFolder, function (err) {
                        console.log("----------------4-----------------")
                        if (err){
                          console.log("----------------5-----------------")
                          fs.unlink(file.path);
                          console.log("----------------6-----------------")
                          reject(err);
                          console.log("----------------7-----------------")
                        }else {
                          console.log("----------------8-----------------")
                          fs.readFile(req.file.path,'utf8', function (err, data) {
                            console.log("----------------9-----------------")
                            var newPath = root_path+constant.UploadPath+shortidFolder+'/'+req.file.originalname;
                            fs.writeFile(newPath, data, function (err) {
                              console.log("----------------10-----------------")
                              //delete the temporary file
                              fs.unlink(req.file.path);
                              console.log("----------------11-----------------")
                                if(err) {
                                  console.log("----------------12-----------------")
                                  reject(err);
                                  console.log("----------------13-----------------")
                                  
                                }else {
                                  console.log("----------------14-----------------")
                                  resolve();
                                }
                              });
                            });
                          }
                        });
                      });
  
                  uploadResume.then((data)=>{
                    console.log("----------------15-----------------")
                    var shortid =  shortidFolder+ "/"+req.file.originalname;
                      var user = {
                            Name: req.body.name,
                            jobTitle: req.body.jobTitle,
                            Email: req.body.Email,
                            PhoneNumber: req.body.phoneNumber,
                            ResumeLocation : shortid
                        };
                        console.log("----------------16-----------------")
                        var connectionEst = MongoDatabase.connection().then((mongoConnectionResult)=>{
                          console.log("----------------17-----------------")
                          var inserted = mongoConnectionResult.mongoConnectionObj.collection('users').insertOne(user).then((insertionSucced)=>{
                            console.log("----------------18-----------------")
                            mongoConnectionResult.mongoConnection.close();
                            console.log("----------------19-----------------")
                                res.json({
                                  status: 200,
                                  message: 'Data successfully inserted !',
                                });
                            });      
                        });
                        
                      
                    
                  }).catch(err =>{
                        res.json({
                          status: 400,
                          message: 'Error while uploading resume, Please try after some time !',
                        });
                  });  
  
          }else{
            
            res.json({
              status: 400,
              message: 'Sorry!!Upload your resume in .docs and .pdf formats only!',
            });
          }
        }
      }    
  })
  
  module.exports = router;