const dbConn = require("../config/dbConnection");
var fromjwt = require("../utils/jwt");
var jwt = fromjwt.jwt;

const pv = (req,res) => {
    console.log("get team details");
    jwt.verify(req.token,"asterics-key-for-token", (err,authData) => {
        if(err) {
            console.log(err+"ERROR : couldn't connect to protected data" + authData);    
                              //create new project
            res.sendStatus(403);
        }
        else {
            let data = req.body;
            let  email = data[0];

            

        }
    })
}