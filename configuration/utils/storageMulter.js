const multer = require("multer");
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
var mysql = require("mysql");
const storage = multer.diskStorage({
    destination: "./app_frontend/public/uploads/",
    filename: function(req, file, cb){
        console.log(req.body, "request188");
        console.log(file.originalname);
        console.log(cb);
       cb(null,"IMAGE-"+ file.originalname );
    }
 });

 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("myImage");

const pictureUpload = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            upload(req, res, function (err) {
                console.log("Request ---", req.body);
                console.log(req.body.user_id);
                let uid = req.body.user_id;
                console.log("Request file ---", req.file);//Here you get file.
                console.log(req.file.filename," filename");
                /*Now do where ever you want to do*/
                if(!err) {
        
                    dbConn.query(`UPDATE usertable SET image="${req.file.filename}" WHERE user_id="${uid}"`)
                    return res.status(200).json({
                        results:req.file
                    });
                }
            })
        }
    });
}
module.exports = pictureUpload;;

