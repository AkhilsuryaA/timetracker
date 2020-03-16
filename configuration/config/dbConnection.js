var mysql = require("mysql");
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'time_tracker_db'
});

module.exports = dbConn;

