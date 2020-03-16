
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
var mysql = require("mysql");
const createProject = (req,res) => {
    console.log("project post called");

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else{
            console.log("token verified");
            let details = req.body;
            var pname = details[0];
            var workspace = details[1];
            var client = details[2];  
            var email = details[3];
            let wid = details[4];
            let uid;
           // console.log(details);
            dbConn.query(`SELECT user_id FROM usertable WHERE email = ?`,[email], function(error,results,fields) {
                if(error) throw error;
                uid = results[0].user_id;
                console.log(uid);
                let sql = `INSERT INTO projects (project,workspace,client,user_id,workspace_id) 
                            VALUES ("${pname}", "${workspace}", "${client}", "${uid}",${wid})`;
                dbConn.query(sql, function(err,response) {
                    if(err) throw err;
                    res.status(200).json({
                        ok:true,
                        success:"success",                                              //create new project
                        results:response
                    });
                    console.log("project added"); 
                })
            })
        }
    });    
}

const projMember = (req,res) => {
    console.log(req.token)
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {console.log("token verified");
            let data = req.body;
            let proj_id = data[0];
            let user_id = data[1];
            let team_id = data[2];
            let role = data[3];
            let member = data[4];
            let member_id ;
            dbConn.query(`select member_id from teammembers where user_id=${user_id} and team_id=${team_id}`, function(err,results) {
                if(err) throw err;
                member_id = results[0].member_id;
                //console.log(results," projects");
                let sql = `insert into projmember (proj_id,member_id,role,members) values ("${proj_id}", "${member_id}", "${role}", "${member}")`;
                dbConn.query(sql, function(error,response){
                    if(error) throw error;
                    res.status(200).json({
                        ok:true,
                        success:"success",
                        response : response
                    });
                    console.log("proj members added")
                })
            })
        }
    })
}

const projectList = (req,res) => {
    
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {console.log("token verified");
            console.log("project list called");
            let t = req.body;
            let uid = t[0];
            let workspace_id = t[1];
            let ownership = t[2];
            let sql ;
            if(ownership === "admin") {
                sql = `SELECT * FROM projects where workspace_id=${workspace_id}`
                dbConn.query(sql, function(err,results) {
                    if(err) throw err;
                    console.log(results);
                    return res.send({error : false,res : results,msg : "projects list"});
                });
            }
            else{/*
                sql = `SELECT * FROM projmember where user_id="${uid}" and workspace_id="${workspace_id}"`
                dbConn.query(sql, function(err,results) {
                    if(err) throw err;
                    let array = [];
                    let len = results.length;
                    let i = 0;
                    console.log(results," joose");
                    results.map((item) => {
                        dbConn.query(`select * from projects where id="${item.proj_id}"`, function(err,response) {
                            if(err) throw err;
                            
                            if(response.length > 0) {
                                array[i] = response[0];
                                i++;

                                if(i === len) {
                                    console.log("array ",array);
                                    res.status(200).json({
                                        error : false,
                                        msg : "projects list",
                                        res:array
                                    });
                                }
                            }
                        })
                    })
                });
            */
                sql = `select a.* from projects a join projmember b on a.id = b.proj_id where b.user_id="${uid}"`;
                dbConn.query(sql, function(err, results) {
                    if(err) throw err;
                    return res.send({error : false,res : results,msg : "projects list"});
                })
            }
            //console.log(t);
           
        }
    });
}

const projmemberList = (req,res) => {
    //console.log(req)
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {console.log("token verified proj member list called");
            let data = req.body;
            let proj_id = data[0];

            dbConn.query(`select * from projmember where proj_id=${proj_id}`, function(err,results) {
                if(err) throw err;
                //console.log(results);
                return res.send({error : false,response : results,msg : "project member list"});
            })
        }
    })
}

module.exports = {
    createProject : createProject,
    projectList : projectList,
    projMember:projMember,
    projMemberList:projmemberList
};


