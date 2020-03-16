

const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
var mysql = require("mysql");
const timerstart = (req,res) => {
    //console.log("new timer post called " + req.body);
    
    var uid;
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if (err) {
            console.log("ERROR : couldn't connect to protected data - timerstart");  
            err = {
               name: 'TokenExpiredError',
               message: 'jwt expired',
               code:403
            }
            return res.json({
                success:false,
                message:"failed to authenticate token",
                code : 403
            });
            return res.status(403).send(err);
         }
        else {
            console.log("token verified");
            var fields = req.body;
            console.log(fields + " new timer");
            var title = fields[0];
            var project = fields[1];
            var client = fields[2];
            var timerStart = fields[3];                                                    //startt new Timer
            var email = fields[4];
            var isStop = fields[5];
            var date = fields[6];
            var time = fields[7];
            let workspace = fields[8];
            
            
            dbConn.query(`SELECT user_id FROM usertable WHERE email = ?`,[email], function(error,results,fields) {
                if(error) throw error;
               /* res.status(200).json({
                    ok: true,
                    success:"success"                                                         //start new Timer
                });*/
                uid = results[0].user_id;
                console.log(" got user_id " + uid);
    let sql = `INSERT INTO usertime(title,project,client,workspace,timerStart,isStop,date,time,user_id) VALUES 
    ("${title}","${project}","${client}","${workspace}","${timerStart}","${isStop}","${date}","${time}","${uid}")`;
                dbConn.query(sql, function(error,results) {
                    if(error) throw error;
                    //console.log(results);
                    dbConn.query(`SELECT * FROM usertime WHERE user_id = ?`,[uid], function(error,results,fields) {
                        if(error) throw error;
                        res.status(200).json({
                            ok:true,
                            success:"success",                                              //start new Timer
                            results:results,
                            fields:fields
                        });
                    })                                        //start new Timer
                    console.log("time added");
                });
            });
                }
            })
}

const timerresume = (req,res) => {
    console.log("times resume update called ");
    
    var uid;
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log("ERROR : couldn't connect to protected data");
            res.sendStatus(403);
        }
        else {
            console.log("token verified");
            var fields = req.body;
            //console.log(fields);
            var title = fields[0];
            var project = fields[1];
            var client = fields[2];
            var timerStart = fields[3];
            var email = fields[4];
            var isStop = fields[5];
            var date = fields[6];
            var time = fields[7];
            var lid = fields[8];
            let uid = fields[9]
           // console.log(fields);
                dbConn.query( `UPDATE usertime SET title = "${title}", project="${project}", client="${client}", 
                timerStart = "${timerStart}",timerTime = "${isStop}", date="${date}",time="${time}" WHERE timer_id = `+ mysql.escape(lid), function(error,results) {
                    if(error) throw error;
                    //console.log(results);
                    dbConn.query(`SELECT title,project,client,timerTime,isStop FROM usertime WHERE user_id = ?`,[uid], function(error,results,fields) {
                        if(error) throw error;
                        res.status(200).json({
                            ok:true,
                            success:"success",
                            results:results,
                            fields:fields
                        });
                    })
                    
                    console.log("time added");
                });
            
                }
            })
}

const updatetime = (req,res) => {
    console.log("timer update stop called ");
    
    var uid;
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        
        if(err) {
            console.log("ERROR : couldn't connect to protected data");
            res.sendStatus(403);
        }
        else {
            console.log("token verified");
            var fields = req.body;
            //console.log(fields);
            var title = fields[0];
            var project = fields[1];
            var client = fields[2];
            var timerStart = fields[3];                            //stopTimer
            var timerTime = fields[4];
            var displayTime = fields[5];
            var email = fields[6];            
            var isStop = fields[7];
            var date = fields[8];
            var time = fields[9];
            var lid = fields[10];
           // console.log(fields);
            
            dbConn.query(`SELECT user_id FROM usertable WHERE email = ?`,[email], function(error,results,fields) {
                if(error) throw error;
              
                uid = results[0].user_id;                                               //stopTimer
                console.log(" got user_id " + uid);     
        
                dbConn.query(`UPDATE usertime SET 
                    title = "${title}",
                    project="${project}",
                    client="${client}",
                    timerStart = "${timerStart}",
                    timerTime = "${timerTime}",
                    displayTime = "${displayTime}",
                    isStop = "${isStop}",
                    date = "${date}"        
                    WHERE timer_id = `+ mysql.escape(lid), function(error,results) {
                    
                        if(error) throw error;
                    //console.log(results);
                    dbConn.query(`SELECT title,project,client,timerTime,displayTime FROM usertime WHERE user_id = ?`,[uid], function(error,results,fields) {
                        if(error) throw error;
                        res.status(200).json({                                //stopTimer
                            ok:true,
                            success:"success",
                            results:results,
                            fields:fields
                        });
                    })
                    
                    console.log("time added");
                });
            });
                }
            })
}

module.exports = {
    timerStart:timerstart,
    timerResume:timerresume,
    timerUpdate:updatetime
}

