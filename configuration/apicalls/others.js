
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;

const workSpace = (req,res) => {

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            console.log("workspace create called");
            let data = req.body;
            let workspace = data[0];
            let uid = data[1];
            
            dbConn.query(`insert into workspaces (workspace,user_id) values ("${workspace}","${uid}")`, function(err,results) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    status:"success",
                    results:results
                });
            });
        }
    })
}

const getWorkSpaceList = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data " + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            console.log("workspace list called");
            let data = req.body;
            let uid = data[0];
            let array = [];
            let i = 0;
            let len;
            dbConn.query(`select workspace_id from teammembers where user_id=${uid}`, function(err,results) {
                if(err) throw err;
                else{
                    len = results.length;
                    //console.log(len, " length")
                    results.map((item) => {
                        //console.log(item.workspace_id," he hey")
                        dbConn.query(`select * from workspaces where id=${item.workspace_id}`, function(err,response) {
                            if(err) throw err;
                            //console.log(response[0])
                            /*res.status(200).json({
                                ok:true,
                                status:"success",
                                results:response
                            });*/
                            array[i] = response[0];
                            
                            i++;
                            if(i === len) {
                                //console.log("array ",array);
                                res.status(200).json({
                                    ok:true,
                                    status:"success",
                                    results:array
                                });
                            }
                        })
                    })
                    
                    
                }
            }); 
        }
    })
}

const getWorkspace = (req,res) => {
    console.log(req.token)
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data " + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let workspace_id = data[0];
            
            dbConn.query(`select * from workspaces where id=${workspace_id}`, function(err,results) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    status:"success",
                    results:results
                });
            }); 
        }
    })
}
const updateTeamid = (req,res) => {
    console.log(req.token)
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data " + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let tid = data[0];
            let wid = data[1];

            dbConn.query(`update workspaces set team_id=${tid} where id = ${wid}`, function(err,results) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    status:"success",
                    results : results
                })
            })
        }
    })
}

module.exports = {
    workspace : workSpace,
    getWorkSpaceList : getWorkSpaceList,
    getWorkspace : getWorkspace,
    updateTeamid : updateTeamid
}
