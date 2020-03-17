var mysql = require("mysql");
const dbConn = mysql.createConnection({
    host: 'us-cdbr-iron-east-04.cleardb.net',//'localhost',
    user: 'bf912305e062b5:eef218b8', //'root',
    password: '//bf912305e062b5:eef218b8', //'qwerty',
    database: 'heroku_51cd0c097780530' //'time_tracker_db'
});

module.exports = dbConn;

