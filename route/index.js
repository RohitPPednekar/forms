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
          
          var imgArr = req.file.originalname.split('.');
                  var format = imgArr[imgArr.length - 1].trim();
                  if(format == 'pdf' || format == 'docs' || format == 'doc' || format == 'docx') {					
                      
                      var fs = require('fs');
            var mkdirp = require('mkdirp');
            var shortidFolder = require('shortid').generate();
  
                  var uploadResume = new Promise((resolve,reject)=>{
                      //Make id folder in the upload directory
                      mkdirp(root_path+constant.UploadPath+shortidFolder, function (err) {
                        if (err){
                          fs.unlink(file.path);
                          reject(err);
                        }else {
                          fs.readFile(req.file.path, function (err, data) {
                            var newPath = root_path+constant.UploadPath+shortidFolder+'/'+req.file.originalname;
                            fs.writeFile(newPath, data, function (err) {
                              //delete the temporary file
                              fs.unlink(req.file.path);
                                if(err) {
                                  reject(err);
                                  
                                }else {
                                  resolve();
                                }
                              });
                            });
                          }
                        });
                      });
  
                  uploadResume.then((data)=>{
                    var shortid =  shortidFolder+ "/"+req.file.originalname;
                      var user = {
                            Name: req.body.name,
                            jobTitle: req.body.jobTitle,
                            Email: req.body.Email,
                            PhoneNumber: req.body.phoneNumber,
                            ResumeLocation : shortid
                        };
                      
                        var connectionEst = MongoDatabase.connection().then((mongoConnectionResult)=>{
                          var inserted = mongoConnectionResult.mongoConnectionObj.collection('users').insertOne(user).then((insertionSucced)=>{
                            mongoConnectionResult.mongoConnection.close();
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