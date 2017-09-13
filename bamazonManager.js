const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

//create connection to database

connection.connect(function(){
    if(err) throw err;
    console.log("Database connected as ID " + connection.threadId);
    console.log(res);
});

