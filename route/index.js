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
var db = require('../utils/db');

/** 
 * Input :- None
 * Output :- File rendered
 * Description :- Get route for main url for rendering the form page
*/
router.get("/",(req,res)=>{
    res.render('header', {baseUrl:constant.baseUrl });
  })
  
  /** 
   * Input :- Body parameter(Name, Email, jobTitle, phoneNumber, resume)
   * Output :- JSON Object
   * Description :- POST route for inserting the form data in the DB and uploading the resume file in the directory
  */
  router.post("/",upload.single('resume'),(req,res)=>{
      
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
                      user = {
                          Name: req.body.name,
                          jobTitle: req.body.jobTitle,
                          Email: req.body.Email,
                          PhoneNumber: req.body.phoneNumber,
                          ResumeLocation : shortid
                      };
                      db.db.users.insert(user);
                        res.json({
                          status: 200,
                          message: 'Data successfully inserted !',
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