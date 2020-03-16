

const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
var mysql = require("mysql");
const listById = (req,res) => {
    console.log("called timer listbyId");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data " + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let workspace = data[1];
            dbConn.query(`SELECT * FROM usertime where user_id="${uid}" and workspace="${workspace}"`, function(err,results,fields) {
                if(err) throw err;
                return res.send({error:false,data : results,message : "the timer list"});
            });
        }
    });
}

const allReport = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            console.log("all report called");
            let data = req.body;
            let uid = data[0];
            let workspace = data[3];
            console.log([data[1],data[2]]);
            dbConn.query(`SELECT * FROM usertime WHERE user_id="${uid}" and workspace="${workspace}" AND DATE(date) >= "${data[1]}" AND DATE(date) <= "${data[2]}"`, function(err,result) {
                if(err) throw err;
                return res.send({error:false, res:result, msg:"all report"});
            });
        }
    });
}

const databyProject = (req,res) => {

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body.data;
            let uid = data[0];
            let workspace = data[3];
            console.log("userid in dataP ",data);
            let sql = `select project,SUM(timerTime) erTime from usertime where user_id="${uid}" and workspace="${workspace}"
            AND DATE(date) >= "${data[1]}" AND DATE(date) <= "${data[2]}" GROUP BY project;`
            dbConn.query(sql,function(error,results,fields) {
                if(error) throw error;
                //console.log(results);
                res.status(200).json({
                    ok:true,
                    results:results,
                    fields:fields
                });
            });
        }
    });
}

const timeByProject = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let uid = data[0];
            let client = data[1];
            let project = data[2];
            let sql =  `select sum(timerTime) timebyproj from usertime where user_id=${uid} and project="${project}"`;
            dbConn.query(sql,function(err,results) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    results:results
                })
            })
        }
    })
}

module.exports = {
    listById : listById,
    allReport : allReport,
    databyProject : databyProject,
    timeByproject:timeByProject
};