
const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;
var mysql = require("mysql");

const createClient = (req,res) => {
    console.log("client post called");

    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err);
            console.log("ERROR : couldn't connect to protected data");                      //create new client
            res.sendStatus(403);
        }
        else{
            console.log("token verified");
            let details = req.body;
            var client = details[0];  
            let uid = details[1];
            let workspace = details[2];
            
           // console.log(details);
                let sql = `INSERT INTO clients (client,user_id,workspace) VALUES ("${client}", "${uid}","${workspace}")`;
                dbConn.query(sql, function(err,response) {
                    if(err) throw err;
                    res.status(200).json({
                        ok:true,
                        success:"success",                                              //create new client
                        results:response
                        
                    });
                    console.log("client added"); 
                })
            
        }
    });
}

const clientList = (req,res) => {
    console.log("client list called");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err);
            console.log("ERROR : couldn't connect to protected data");                      //create new client
            res.sendStatus(403);
        }
        else {
            console.log("token verified");
            let t = req.body;
            console.log(t);
            let uid = t[0];
            let workspace = t[1];
            dbConn.query(`SELECT * FROM clients where workspace="${workspace}"`, function(err,results) {
                if(err) throw err;
                
                return res.send({error : false,res : results,msg : "clients list"});
            });
        }
    })
}

module.exports = {
    createClient : createClient,
    clientList : clientList
};
