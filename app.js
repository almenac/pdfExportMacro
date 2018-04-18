// App requirements

var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");

var connection = mysql.createConnection({
   host: "localhost",
   user: "almenac",
   database: "rpg_list"
});

// App configs

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// DATABASE SETUP

var createRpgTable = 'CREATE TABLE IF NOT EXISTS rpgs('
    + "id INT AUTO_INCREMENT PRIMARY KEY,"
    + "name VARCHAR(255) NOT NULL,"
    + "system VARCHAR(100),"
    + "setting VARCHAR(100),"
    + "product_type VARCHAR(100),"
    + "product_form VARCHAR(100),"
    + "is_read VARCHAR(25),"
    + "genre VARCHAR(100),"
    + "created_at TIMESTAMP DEFAULT NOW()"
    +  ')';

var insertSeed = 'INSERT INTO rpgs (name, system, setting, product_type, product_form, is_read, genre) VALUES'
    + "('Hellfrost Action Deck', 'Savage Worlds', 'Hellfrost', 'Supplement', 'pdf', 'No', 'Fantasy'),"
    + "('Toinen Hellfrost-tuote', 'Savage Worlds', 'Hellfrost', 'Supplement', 'pdf', 'No', 'Fantasy'),"
    + "('Kolmas Hellfrost-tuote', 'Savage Worlds', 'Hellfrost', 'Supplement', 'pdf', 'No', 'Fantasy');"
    
// Drop database rpg_list if it exists
connection.query("DROP DATABASE IF EXISTS rpg_list", function(err){
    if(err) throw err;
    // Create database rpg_list
    connection.query('CREATE DATABASE rpg_list', function (err) {
        if (err) throw err;
        // Use created rpg_list
        connection.query('USE rpg_list', function (err) {
            if (err) throw err;
            // Create table "rpgs" from variable
            connection.query(createRpgTable, function (err) {
                    if (err) throw err;
                    // Insert seed data from variable
                    connection.query(insertSeed, function(err) {
                        if(err) throw err;
                });
            });
        });
    });
});

//ROUTES

//Root route

app.get("/", function(req, res){
    res.render("home");
});

app.get("/home", function(req, res){
    res.redirect("/");
});

//INDEX route

app.get("/rpgs", function(req, res){
    var q = "SELECT * FROM rpgs";
    connection.query(q, function(err, rpgs){
        if(err) throw err;
        res.render("rpgs", {rpgs: rpgs});
    });
});

//New route

app.get("/new", function(req,res){
   res.render("new");
});

//Create route

// app.post("/new", function(req, res){
//     var rpg = {
//         name: req.body.name,
//         system: req.body.system,
//         setting: req.body.setting,
//         product_type: req.body.product_type,
//         product_form: req.body.product_form,
//         is_read: req.body.is_read,
//         genre: req.body.genre
//     };
    
//     connection.query("INSERT INTO rpgs SET ?", rpg, function(err, result){
//       if(err) throw err;
//       res.redirect("/rpgs");
//     });
// });

app.post("/new", function(req, res){
    // var rpg = {
    //     name: req.body.name,
    //     system: req.body.system,
    //     setting: req.body.setting,
    //     product_type: req.body.product_type,
    //     product_form: req.body.product_form,
    //     is_read: req.body.is_read,
    //     genre: req.body.genre
    // };
    
    connection.query("INSERT INTO rpgs SET ?", req.body.rpg, function(err, result){
       if(err) throw err;
       res.redirect("/rpgs");
    });
});



//INITIATE SERVER

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});