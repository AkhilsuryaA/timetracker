
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
const bcrypt = require("bcryptjs");
var mysql = require("mysql");

const getUser = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;

            dbConn.query(`SELECT * FROM usertable WHERE user_id = ${data[0]}`,function(error,results) {
                if(error) throw error;
                res.status(200).json({success:"success", data:results})
            })
        }
    })
}

const editPassWord = (req,res) => {
    console.log("edit profile called");

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let curPs = data[1];
            let newPs = data[2];
            let email = data[3];
            console.log(data);
            dbConn.query(`SELECT * FROM userTable WHERE user_id="${uid}" and email="${email}"`, function(error,results,fields) {
                if(error) {
                    res.send({
                        "code":400,
                        "failed":"error ocurred"
                      })
                      throw error;
                }
                else {
                    if(results.length > 0) {
                        console.log(results);
                        bcrypt.compare(curPs,results[0].password, function(err, isMatch) {
                            if(err) {
                              throw err;
                            }
                            else 
                                if(!isMatch) {
                                res.send({
                                "code":204,
                                "success":"passwords does not match"
                                  });
                                }
                                else {
                                        const saltRounds = 10;

                                        bcrypt.genSalt(saltRounds, function (err,salt) {
                                        if(err) {
                                            throw err;
                                        }
                                        else {
                                            console.log(salt);
                                            bcrypt.hash(newPs, salt, function(err, hash) {
                                                if(err) throw err;
                                                console.log(hash);

                                                let sql = `UPDATE usertable SET password="${hash}" WHERE user_id="${uid}"`;
                                                dbConn.query(sql,function (error, results) {
                                                    if(error) throw error;
                                                    res.status(200).json({
                                                        code:200,
                                                        ok:true,
                                                        success:"password updated"
                                                    });
                                                    //res.json({"status":"success", id: results.id});
                                                    console.log("password added");
                                                })
                                             })
                                        }
                                    })
                                }
                        })
                    }
                    else {
                    res.send({
                        "code":204,
                        "success":"User does not exits"
                          });
                }
            }
            })
        }
    })
}
        
    
const editName = (req,res) => {
    console.log("edit profile called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let fName = data[1];
            let lName = data[2];
             let sql = `UPDATE usertable SET fName="${fName}",lName="${lName}" WHERE user_id="${uid}"`;
            dbConn.query(sql,function (error, results) {
                if(error) throw error;
                res.status(200).json({
                    ok:true,
                    success:"success"
                });
                //res.json({"status":"success", id: results.id});
                console.log("address added");
            })
        }
    });
}


const editEmail = (req,res) => {
    console.log("edit profile called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let email = data[1];
            let sql = `UPDATE usertable SET email="${email}" WHERE user_id="${uid}"`;
            dbConn.query(sql,function (error, results) {
                if(error) throw error;
                res.status(200).json({
                    ok:true,
                    success:"success"
                });
                //res.json({"status":"success", id: results.id});
                console.log("email added");
            })
        }
    });
}

const editPh = (req,res) => {
    console.log("edit profile called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let ph = data[1];
            let sql = `UPDATE usertable SET phno="${ph}" WHERE user_id="${uid}"`;
            dbConn.query(sql,function (error, results) {
                if(error) throw error;
                res.status(200).json({
                    ok:true,
                    success:"success"
                });
                //res.json({"status":"success", id: results.id});
                console.log("phone added");
            })
        }
    });
}

const editAddress = (req,res) => {
    console.log("edit profile called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let address = data[1];
            let sql = `UPDATE usertable SET address="${address}" WHERE user_id="${uid}"`;
            dbConn.query(sql,function (error, results) {
                if(error) throw error;
                res.status(200).json({
                    ok:true,
                    success:"success"
                });
                //res.json({"status":"success", id: results.id});
                console.log("address added");
            })
        }
    });
}

module.exports = {
    address : editAddress,
    email : editEmail,
    password : editPassWord,
    phno : editPh,
    name : editName,
    getUser : getUser
};

