
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;

const createTeam = (req,res) => {
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            console.log(" add team called");
            let data = req.body;
            let uid = data[0];
            let email = data[1];
            let access = data[2];
            let workspace_id = data[3];
            let sql = `INSERT INTO team (email,access,workspace_id,user_id) VALUES ("${email}", "${access}", "${workspace_id}", "${uid}")`;
            dbConn.query(sql, function(err, response) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    success:"success",
                    results:response
                }); 
            });
        }
    });
}

const addMember = (req,res) => {
    

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            console.log("team member post called");
            let data = req.body;
            let team_id = data[0];
            let uid = data[1];
            let email = data[2];
            let access = data[3];
            let ownership = data[4];
            console.log(data);
            let sql = `INSERT INTO teammembers (email,access,ownership,user_id,team_id) VALUES ("${email}", "${access}","${ownership}","${uid}","${team_id}") `;
            dbConn.query(sql, function(err, response) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    success:"success",
                    results:response
                }); 
            });
        }
    });
}

const createInvite = (req,res) => {
    console.log("create invite called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let reciever = data[0];
            let sender = data[1];
            let team_id = data[2];
        
            let sql = `INSERT INTO invitations (reciever,sender,team_id) VALUES  ("${reciever}", "${sender}","${team_id}")`;
            dbConn.query(sql, function(err, response) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,success:"success",results:response
                })
            })
        }
    });
}

const checkInvite = (req,res) => {
    console.log("invitaion check called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let email = data[0];
            console.log(email," email");
        
            dbConn.query(`SELECT * FROM invitations where reciever = ?`,[email],function(error,results) {
                if(error) throw error;
                res.status(200).json({
                    ok:true,
                    status:"ok",
                    results:results
                });
            });
        }
    });
}

const getTeam = (req,res) => {
    console.log("get team details");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let workspace_id = data.workspace_id;
            console.log(workspace_id);
        
            dbConn.query(`SELECT * FROM team where workspace_id="${workspace_id}"`, function(err,results) {
                if(err) throw err;
                //console.log(results," results");
                res.status(200).json({
                    ok:true,
                    status:"ok",
                    results:results
                })
            })
        }
    });
}

const getMembers = (req,res) => {
    console.log("get members");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            console.log(data[0]);
            dbConn.query(`SELECT * FROM teammembers WHERE team_id="${data[0]}"`,function(err,results) {
                if(err) throw err;
                res.status(200).json({
                    ok:true,
                    status :"success",
                    results:results
                })
            })
        }
    });
}


module.exports = {
    createTeam : createTeam,
    addMember : addMember,
    createInvite : createInvite,
    checkInvite : checkInvite,
    getTeam : getTeam,
    getMembers : getMembers
};

