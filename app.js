// App requirements

var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var connection = mysql.createConnection({
   host: "localhost",
   user: "almenac",
   database: "rpg_list",
   multipleStatements: "true"
});

// App configs

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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
    + "('Second Hellfrost product', 'Savage Worlds', 'Hellfrost', 'Supplement', 'pdf', 'No', 'Fantasy'),"
    + "('Third Hellfrost product', 'Savage Worlds', 'Hellfrost', 'Supplement', 'pdf', 'Yes', 'Fantasy');"
    
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

//===========================================
//ROUTES
//===========================================

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
    var q2 = "SELECT COUNT(*) as count FROM rpgs";
    connection.query(q2, function(err, results, fields){
        if(err) throw err;
        connection.query(q, function(err, rpgs){
            if(err) { 
                console.log(err);
                res.redirect("/")
            } else {
                res.render("rpgs", {rpgs: rpgs, count: results[0].count});
            }
        });    
    })
});

// app.get("/rpgs", function(req, res){
//     var q = "SELECT * FROM rpgs";
//     connection.query(q, function(err, rpgs){
//         if(err) { 
//             console.log(err);
//             res.redirect("/")
//         } else {
//             res.render("rpgs", {rpgs: rpgs});    
//         }
//     });
// });

//INDEX of unread
app.get("/rpgs/unread", function(req, res){
   var q = "SELECT * FROM rpgs WHERE is_read='No'";
   connection.query(q, function(err, results, fields){
       if(err) {
           console.log(err);
           res.redirect("/");
       } else {
           res.render("unread", {rpgs: results})
       }
   })
});

//NEW route

app.get("/new", function(req,res){
   res.render("new");
});

//CREATE route

app.post("/rpgs", function(req, res){
    connection.query("INSERT INTO rpgs SET ?", req.body.rpg, function(err, result){
       if(err) throw err;
       res.redirect("/rpgs");
    });
});

//SHOW route

app.get("/rpgs/:id", function(req, res){
    var q = 'SELECT * FROM rpgs WHERE id='+req.params.id;
    connection.query(q, function(err, results, fields){
        if(err) {
            console.log(err)
            res.redirect("/")
        } else {
            res.render("show", {rpg: results[0]});    
        };
    });
});

//EDIT route

app.get("/rpgs/:id/edit", function(req, res){
    var q = 'SELECT * FROM rpgs WHERE id='+req.params.id;
    connection.query(q, function(err, results, fields){
        if(err) {
            res.redirect("/");
        } else {
            res.render("edit", {rpg: results[0]});
        }
    });
});

//UPDATE route

app.put("/rpgs/:id", function(req, res){
    var q = "UPDATE rpgs SET ? WHERE id="+req.params.id;
    connection.query(q, req.body.rpg, function(err,results){
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/rpgs/"+req.params.id);    
        }
    });
});

//DELETE route
app.delete("/rpgs/:id", function(req, res){
   var q = "DELETE FROM rpgs WHERE id="+req.params.id;
   connection.query(q, req.body.rpg, function(err, results){
       if(err) {
           console.log(err);
           res.redirect("/")
       } else {
           res.redirect("/rpgs");
       }
   });
});

//Catch-all -route
app.get("*", function(req, res){
    res.redirect("/")
});


//INITIATE SERVER

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});