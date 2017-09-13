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

connection.connect(function(err){
    if(err) throw err;
    console.log("Database connected as ID " + connection.threadId);
    // displayAll();
    // lowInventory();
    // addToInventory();
    // addNewProduct();
    // removeProduct();
    start();
});

function start(){
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "Selection: ",
        choices: ["List all products", "List low inventory", "Add to inventory", "Add new product", "Remove product"]
    })
    .then(function(answer){
        if(answer.action == "List all products") {
            displayAll();
        } else if(answer.action === 'List low inventory') {
            lowInventory();
        } else if (answer.action == " Add to inventory"){
            addToInventory();
        } else {
            removeProduct();
        }
    });
}

//function to list All product info
function displayAll(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log(res);
    });
    start();
}

//function viewing product that has quantity < 5
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if(err) throw err;
        console.log(res);
    });
    start();    
}

//function add quantity to specific product
function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        inquirer
        .prompt([{
            name: "addProducts",
            type: "list",
            message: "What product you want to add?",
            choices: function(){
                var choiceArr = [];
                for(var i = 0; i < res.length; i++){
                    choiceArr.push(res[i].product_name);
                }
                return choiceArr;
            }
        },{
            name: "productQuantity",
            type: "input",
            message: "How may items that you want to add?",
            validate: function(value){
                if(isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }])
        .then(function(answer){
            var userchoice, newQuantity;
            for(var i = 0; i < res.length; i++){
                if(answer.addProducts === res[i].product_name) {
                    userchoice = res[i];
                }
            }
            newQuantity = userchoice.stock_quantity + parseInt(answer.productQuantity);
            //add quantity to database
            connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newQuantity}, {product_name: userchoice.product_name}], function(){
                console.log("You've just added " + newQuantity + "to " + userchoice.product_name);
                console.log(userchoice.product_name + "quantity: " + newQuantity);
            });
        })
    });
    start();    
}

//function add new product

function addNewProduct() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Enter product name: "
            },
            {
                name: "departmentName",
                type: "input",
                message: "Enter department name: "
            },
            {
                name: "price",
                type: "input",
                message: "Enter price:"
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "Enter stock quantity: "
            }
        ]).then(function(answer){
            var query = "";
            query += "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ";
            query += "(" + "'" + answer.productName + "'" + "," + "'" + answer.departmentName + "'" +"," + answer.price + "," + answer.stockQuantity + ")";
            console.log(query);
            connection.query(query, function(err, res) {
                if(err) throw err;
                console.log("Add product sucessfully");
            })
        })
    });
    start();    
}

//function to remove product
function removeProduct() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        inquirer
        .prompt({
            name: "removeProducts",
            type: "list",
            message: "What product you want to remove from database?",
            choices: function(){
                var choiceArr = [];
                for(var i = 0; i < res.length; i++){
                    choiceArr.push(res[i].product_name);
                }
                return choiceArr;
            }
        }).then(function(answer) {
            var userchoice;
            for(var i = 0; i< res.length; i++) {
                if(answer.removeProducts == res[i].product_name){
                    userchoice = res[i];
                }
            }
            connection.query("DELETE FROM products WHERE ?",[{product_name: userchoice.product_name}], function(err, res){
                if (err) throw err;
                console.log("Removed successullfy!");
            })
        })
    });
    start();    
}