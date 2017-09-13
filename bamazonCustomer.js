const mysql = require("mysql");
const inquirer = require("inquirer");

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
    displayALL();
    placeOrder();
});

//function to display all the data that available for sale
function displayALL() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log("All items for sales: " + "\n");
        for(var i= 0; i < res.length; i++) {
            console.log(res[i].item_id, res[i].product_name, "$" + res[i].price);
        }
        
    });
}

// main function start

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
            } else {
                var newQuantity = chosenItem.stock_quantity - answer.buyQuantity;
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {product_name: answer.buyName}], function(err, res){
                    if(err) throw err;
                console.log("You've just bought " + answer.buyQuantity + " " + answer.buyName + " successfully");   
                console.log("Your total cost is: " + answer.buyQuantity * chosenItem.price);             
                });
            }
        });
    });
}