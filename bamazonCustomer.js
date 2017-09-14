const mysql = require("mysql");
const inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');


//initiate connection to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// create connection to bamazon database

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    start();
});

//function to ask user to buy or display products

function start() {
    inquirer
    .prompt({
        name: "userchoice",
        type: "list",
        message: " Do you want to display or buy products?",
        choices: ["Display all products", "Buy products"]
    })
    .then(function(answer){
        if(answer.userchoice == "Display all products") {
            displayALL();
            start();
        } else if (answer.userchoice == "Buy products") {
            placeOrder();
        }
    });
}

//function to display all the data that available for sale
function displayALL() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        var table = new Table({
            head: ['ID#'.cyan, 'Product'.blue, 'Price'.blue, 'Department'.blue],
            colWidths: [6, 50, 10, 25]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, '$' + res[i].price, res[i].department_name]);
        }

        console.log('\n' + table.toString());

        // console.log("All items for sales: " + "\n");
        // for(var i= 0; i < res.length; i++) {
        //     console.log(res[i].item_id, res[i].product_name, "$" + res[i].price);
        // }
    });
}

// placeorder function start

function placeOrder() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        // prompt user which product to buy
        inquirer
        .prompt([
            {
                name: "buyName",
                type: "list",
                message: "Which product that you would like to buy",
                choices: function(){
                    var choiceArray = [];
                    for(var i = 0; i < res.length; i++){
                        choiceArray.push(res[i].product_name)
                    }
                    return choiceArray;
                }
            },
            {
                name: "buyQuantity",
                type: "input",
                message: "How many unit that you want to buy?",
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer){
            //get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if(res[i].product_name === answer.buyName){
                    chosenItem = res[i];
                }
            }
            // console.log(chosenItem);
            if(chosenItem.stock_quantity < answer.buyQuantity) {
                console.log("Insufficient quantity!");
                start();
            } else {
                var newQuantity = chosenItem.stock_quantity - answer.buyQuantity;
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {product_name: answer.buyName}], function(err, res){
                    if(err) throw err;
                console.log("You've just bought " + answer.buyQuantity + " " + answer.buyName + " successfully");   
                console.log("Your total cost is: " + answer.buyQuantity * chosenItem.price);
                start();                
                });
            }
        });
    });
}
