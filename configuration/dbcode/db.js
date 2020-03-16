var mysql = require("mysql");
var dbConn = require("../config/dbConnection");

//create database...
/*
dbConn.query("CREATE DATABASE time_tracker_db", function(err, result) {
    if(err) throw err;
    console.log("Database created...");
});
*/
//create table...

/*
 // create details table.....
 let sql = `CREATE TABLE usertable (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fName VARCHAR(255),
    lName VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    address varchar(255),
    phno varchar(255),
	company varchar(255),
    email2 varchar(255),
    dob varchar(255),
    gender varchar(255),
    state varchar(255),
    country varchar(255),
    pin varchar(20)
);`;
    dbConn.query(sql, function(err, results) {
        if (err) throw err;
        console.log("Table created");
    });
*/

//create project table....... 
/*
let sql = `CREATE TABLE projects (id int auto_increment primary key,
    project varchar(255),
    workspace varchar(255),
    client varchar(255),
    user_id int,
    FOREIGN KEY (user_id) REFERENCES usertable(user_id)
    );`;
    dbConn.query(sql, function(err, results) {
        if(err) throw err;
        console.log("table created");
    })
*/
/*
let sql = `create table projmember (pm_id int auto_increment primary key,
    proj_id int,
    member_id int,
    role varchar(255),
    foreign key (proj_id) references projects(id)
    );`;
    dbConn.query(sql, function(err, results) {
        if(err) throw err;
        console.log("table created");
    })
*/
//           create clients table........
/*
let sql1 = `CREATE TABLE clients (id int auto_increment primary key,
    
    client varchar(255),
    user_id int,
    FOREIGN KEY (user_id) REFERENCES usertable(user_id)
    );`;
    dbConn.query(sql1, function(err, results) {
        if(err) throw err;
        console.log("table created");
    })
*/
///////..........create workspace table
/*
let sql = `create table workspaces (id int auto_increment primary key,
            workspace varchar(255),
            user_id int,
            foreign key (user_id) references usertable(user_id)
            );`;
    dbConn.query(sql,function(err, results) {
        if(err) throw err;
        console.log('table created');
    })
*/

//......create .....team table

/*
let sql = `CREATE TABLE team (team_id int auto_increment primary key,
    email varchar(255),
    access varchar(255),
    user_id int,
    FOREIGN KEY (user_id) REFERENCES usertable(user_id)
    )`;
    dbConn.query(sql, function(err, results) {
        if(err) throw err;
        console.log("table created");
    })
*/
/*
let sql = `CREATE TABLE teammembers (member_id int auto_increment primary key,
    email varchar(255),
    access varchar(255),
    user_id int,
    team_id int,
    FOREIGN KEY (team_id) REFERENCES team(team_id)
    )`;
    dbConn.query(sql, function(err, results) {
        if(err) throw err;
        console.log("table created");
    })
*/
//dbConn.query(`ALTER TABLE usertable ADD image varchar(255) AFTER user_id`)
//dbConn.query(`ALTER TABLE team ADD ownership varchar(255) AFTER access`);
//dbConn.query(`ALTER TABLE teammembers ADD ownership varchar(255) AFTER access`)
//dbConn.query(`ALTER TABLE projmember ADD members varchar(255) AFTER role`);
//dbConn.query(`alter table team add workspace_id int after user_id`);
/////////..........create timer table....
/*
let sql = `CREATE TABLE usertime (
    timer_id int NOT NULL auto_increment primary key,
    title varchar(255),    
    project varchar(255),
    client varchar(255),
    timerStart varchar(255),
    timerTime varchar(255),
    displayTime varchar(255),
    isStop varchar(255),
    date DATETIME,
    time varchar(255), 
    user_id int,
    FOREIGN KEY (user_id) REFERENCES usertable(user_id)
);`;
    dbConn.query(sql, function(err, results) {
        if (err) throw err;
        console.log("Table created");
    });
*/
/*
let sql = `CREATE TABLE invitations (
    invite_id int not null auto_increment primary key,
    reciever varchar(255),
    sender varchar(255),
    team_id int,
    FOREIGN KEY (team_id) REFERENCES team(team_id)
);`;
dbConn.query(sql,function(err, results) {
    if(err) throw err;
    console.log("table created");
})
*/




