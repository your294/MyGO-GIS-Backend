const mysql = require("mysql");

const connection = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "123456",
  database: "mygo_gis",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = {
  connection,
};
