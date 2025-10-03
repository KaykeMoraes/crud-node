const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "kayak.10", // altere para sua senha
    database: "crud_node"
}).promise();

module.exports = db;