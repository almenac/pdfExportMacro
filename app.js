// App requirements

var express = require("express");
var app = express();

// App configs

app.set("view engine", "ejs");

//ROUTES

//Root route

app.get("/", function(req, res){
    res.render("home");
});

//rpgs route

app.get("/rpgs", function(req, res){
    res.render("rpgs");
})


//INITIATE SERVER

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});