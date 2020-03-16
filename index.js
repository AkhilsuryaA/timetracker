var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var mysql = require("mysql");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// connection configurations
const dbConn = require("./configuration/config/dbConnection");
  
// connect to database
dbConn.connect(function(err) {
    if(err) throw err;
    console.log("Connected!");
});

require("./configuration/dbcode/db");
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// Serve the static files from the React app

app.use(express.static(path.join(__dirname, 'app_frontend/public')));

// An api endpoint that returns a short list of items

/** it was before start deploying app
 * app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/app_frontend/public/index.html'));
});
 */
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

    ///////  token.....

var fromjwt = require("./configuration/utils/jwt");
var jwt = fromjwt.jwt;
const generateToken = fromjwt.generateToken;
//process.env.JWT_SECRET
const checkToken = fromjwt.checkToken;

//..............upload img

const pictureUpload = require("./configuration/utils/storageMulter");
app.post('/api/upload',checkToken, pictureUpload);

///////.............send ..Email

const send = require("./configuration/apicalls/sendEmail");
app.post('/api/sendEmail',checkToken, send);

// Retrieve all usertable 

app.get('/user', function (req, res) {
    dbConn.query('SELECT * FROM usertable', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'usertable list.' });
    });
});
 
app.get('/api/user/timetable', function (req, res) {
    dbConn.query('SELECT * FROM usertime', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'usertable times.' });
    });
});

// Retrieve user with id 
/*
app.get('/user/:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
  
    dbConn.query('SELECT * FROM usertable where user_id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'usertable list.' });
    });
  
});
 */

//.........GET TIME TABLE FROM DB.....

const lists = require("./configuration/apicalls/usertimeLists");


app.post("/api/list",checkToken, lists.listById); 
//............get all report.....
app.post("/api/user/list/allReport",checkToken ,lists.allReport);
//............getting the data by projects
app.post("/api/dataP",checkToken, lists.databyProject);
//.........getting time by project.......
app.post("/api/user/timeByProject", checkToken,lists.timeByproject);
/////////.........user ops...


const ops = require("./configuration/apicalls/userOps");

//sign in to db
app.post("/api/user/signin", ops.signin);
// Add a new user  
app.post("/api/user/signup", ops.signup);
//.......updating userinformation..
app.put("/api/user/details", ops.useraupdate);
app.put("/api/update/privilage",checkToken,ops.updatePrivs);

//signin using google

app.post("/api/checkEmail", function(req,res) {
    let data = req.body;
    let email = data.email
    console.log(email, " came here ",data);
    dbConn.query(`SELECT * FROM usertable WHERE email=?`,[email],function(error,results,fields) {
        if(error) {
            console.log("error here ", error);
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        } else {
            console.log("success ",results);
            res.send({
                "code":200,
                "success":"login sucessfull",
                "data":results
                  });
        }
    })
});

app.post("/api/googleLogin", function(req,res) {
    let data = req.body;
    dbConn.query(`select * from usertable where email=?`,[data.email], function(error,results) {
        if(error) {
            console.log("error at g login")
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        }
        else {
            if(results.length > 0) {
                let token = generateToken(data.email,results[0].user_id);
                res.send({
                    code:200,
                    success:"login sucessfull",
                    data:results[0],
                    token:token
                });
            }
        }
    })
})


const projects = require("./configuration/apicalls/project");

// create new project.....
app.post("/api/user/project",checkToken, projects.createProject);
// create project members .........
app.post("/api/user/projmember",checkToken, projects.projMember);
//...........get project table from db
app.post("/api/user/project/list",checkToken, projects.projectList);
//.........get proj members from db
app.post("/api/user/getProjMember", checkToken, projects.projMemberList);


const clients = require("./configuration/apicalls/client");

//..........create new client.........
app.post("/api/user/client",checkToken, clients.createClient);
// .........get client table from db...
app.post("/api/user/client/list",checkToken, clients.clientList);


//.......workspace.....
const worksp = require('./configuration/apicalls/others');


//....create workspace
app.post("/api/createworkspace", checkToken, worksp.workspace);
//''''''''''get workspaces....
app.post("/api/get/workspList", checkToken, worksp.getWorkSpaceList);
app.post("/api/get/workspace", checkToken,worksp.getWorkspace);
app.post("/api/worksp/teamid",checkToken,worksp.updateTeamid);

//...........TEAM..........
//.........create team ........
const team = require("./configuration/apicalls/team");

app.post("/api/createteam",checkToken, team.createTeam)
/// ...........add to team
app.post("/api/addmember",checkToken, team.addMember);
app.post("/api/createinvite",checkToken, team.createInvite);
app.post("/api/checkinvite",checkToken, team.checkInvite);
app.post("/api/getteam",checkToken, team.getTeam);
app.post("/api/getmembers",checkToken, team.getMembers);

//.............editing the profile page
const edit = require("./configuration/apicalls/profilePage");


//.....get user ............
app.post("/api/getUser", checkToken,edit.getUser );
app.put("/api/editProfile/address",checkToken, edit.address);
app.put("/api/editProfile/email",checkToken,edit.email);
app.post("/api/editProfile/changePassword", checkToken, edit.password);
app.put("/api/editProfile/ph", checkToken, edit.phno);
app.put("/api/editProfile/name",checkToken, edit.name);


// ...uploading time to db .....timer start,resume,update
const timerfunctions = require("./configuration/apicalls/timerPage");


/////////////.................it runs in start new Timer
app.post("/api/user/timerStart",checkToken,timerfunctions.timerStart );
//it runs in resumeTimer
app.put("/api/user/timerResume",checkToken, timerfunctions.timerResume);
// it runs in stop timer
app.put("/api/user/updateTime",checkToken, timerfunctions.timerUpdate);


 // .....Delete item..

app.delete("/api/deleteItem", function (req, res) {
  console.log("called delete");
    
    let uid = req.body.uid;
    let id = req.body.id;
  console.log(uid + " id " + id);
   /**
    *  if (!uid) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    */
    dbConn.query('DELETE FROM usertime WHERE user_id = ? and timer_id = ?', [uid, id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Timer has been updated successfully.' });
    });
}); 

// set port

app.listen(5000, function () {
    console.log('Node app is running on port 5000');
});
 
module.exports = app;

