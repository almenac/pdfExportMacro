// App requirements

var express = require("express");
var app = express();
var mysql = require("mysql");

var connection = mysql.createConnection({
   host: "localhost",
   user: "almenac",
   database: "rpg_list"
});

// App configs

app.set("view engine", "ejs");

//ROUTES

//Root route

app.get("/", function(req, res){
    res.render("home");
});

//rpgs route

app.get("/rpgs", function(req, res){
    // store SQL count query in variable
    var q = "SELECT COUNT(*) as count FROM rpgs"
    //perform query with callback
    connection.query(q, function(err, results){
        if(err) throw err
        var count = (results[0].count);
        res.render("rpgs", {count: count});
    });
});


//INITIATE SERVER

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});