
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
const bcrypt = require("bcryptjs")
var jwt = fromjwt.jwt;
var mysql = require("mysql");
var generateToken = fromjwt.generateToken;
var checkToken = fromjwt.checkToken;

const signin = (req,res) => {
    var data = req.body;
    //console.log("post in called   " + req.body);
    var email = data[0];
    var password = data[1];

    dbConn.query('SELECT * FROM usertable WHERE email = ?',[email], function (error, results, fields) { 
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){

        bcrypt.compare(password,results[0].password, function(err, isMatch) {
          if(err) {
            throw err;
          }
          else if(!isMatch) {
            res.send({
              "code":204,
              "success":"Email and password does not match"
                });
          }
          else {
            var token = generateToken(email,results[0].user_id); 
            console.log("userid = " + results[0].user_id);
            res.send({
            "code":200,
            "success":"login sucessfull",
            "token":token
              });
          }
        })
      }

      else {
        res.send({
          "code":204,
          "success":"Email does not exits"
            });
      }
    }
    });
}


const signup = (req,res) => {
    console.log("post called");
    var fields = req.body;
    var fname = fields[0];
    var lname = fields[1];
    var email = fields[2];
    var pass = fields[3];
    console.log(pass);
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) {
        throw err;
      }
      else {console.log(salt)
        bcrypt.hash(pass, salt, function(err, hash) {
          if(err) throw err;
          console.log(hash);

          var sql = `INSERT INTO usertable(fname,lname,email,password) VALUES ("${fname}","${lname}", "${email}", "${hash}")`;
        dbConn.query(sql, function(error, results) {
        if(error) throw error;
        console.log(results.insertId);
        var token = generateToken(email,results.insertId);
        res.status(200).json({
            ok: true,
            token : token,
            success : "success"
        });
        //res.json({"status":"success", id: results.user_id})
        console.log("data adding");
    })
        })
      }
    })
}

const updateDetails = (req,res) => {
    console.log("details post called");
    var fields = req.body;
    // console.log(fields);
    var address = fields[0];
    var phno = fields[1];
    var company = fields[2];
    var email2 = fields[3];
    var dob = fields[4];
    var gender = fields[5];
    var state = fields[6];
    var country = fields[7];
    var pin = fields[8];
    let uid = fields[9];
    let sql = `UPDATE usertable SET address="${address}", phno="${phno}", company="${company}", email2="${email2}",
    dob="${dob}", gender="${gender}", state="${state}", country="${country}", pin="${pin}" WHERE user_id="${uid}"`;
    dbConn.query(sql,function (error, results) {
        if(error) throw error;
        res.status(200).json({
            ok:true,
            success:"success"
        });
        //res.json({"status":"success", id: results.id});
        console.log("details added");
    })
}

const updatePrivs = (req,res) => {
  console.log("token is  ",req.token);
  jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
    if(err) {
        console.log(err+" ERROR : couldn't connect to protected data" + authData);    
        res.sendStatus(403);
    }
    else{
      let data = req.body;
      let ownership = data[0];
      let worksp_id = data[1];
      let uid = data[2];
      let sql = `update usertable set ownership="${ownership}", worksp_id="${worksp_id}" where user_id=${uid}`;
      dbConn.query(sql, function(error, results) {
        if(error) throw error;
        res.status(200).json({
          ok:true,
          success:'success'
        })
      })
    }
  })
}
module.exports = {
    signin :signin,
    signup : signup,
    useraupdate : updateDetails,
    updatePrivs : updatePrivs
};


