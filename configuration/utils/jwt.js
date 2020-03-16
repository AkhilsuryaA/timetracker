

var mysql = require("mysql");
var jwt = require("jsonwebtoken");
function generateToken(email,user_id) {
  
    var u = {
        //fname: fname,
       // lname: lname,
        email: email,
        id: user_id,
        
       };
       let token;   
       return token = jwt.sign(u, "asterics-key-for-token", {
          expiresIn: 60 * 60*6 // expires in 6 hours
       });
     }

const checkToken = (req,res,next) => {
    console.log("check token called");
    //console.log(req.header + " 1 " + req + " 2 " + req.body);
    //const head = req.header['authorization'];
    var head = (req.body && req.body.Authorization) || (req.query && req.query.Authorization) || req.headers['authorization'];
    //console.log(head);
    if(typeof head !== 'undefined') {
        const bearer = head.split(' ');
        const token = bearer[1];
        //console.log(token);
        req.token = token;
        next();
       }
    else {
        console.log("cannot access data");
        res.sendStatus(403);
    }
} 
module.exports = { jwt:jwt,
                   generateToken : generateToken,
                   checkToken : checkToken
                };

                