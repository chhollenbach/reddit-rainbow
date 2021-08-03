const express = require("express");
var app = express();
const basicAuth = require('express-basic-auth')
const dotenv = require('dotenv').config();

// secure creds for POST to DB
const user = process.env.USER;
const pass = process.env.PASS;
var users = {};
users[user] = pass;

// DATABASE URL for Heroku postgresql - not needed when deploying
const DATABASE_URL = process.env.DATABASE_URL;
const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

client.connect();

// query objects
const dropTableQuery = 'DROP TABLE IF EXISTS reddit_rainbow_raw';
const createTableQuery = 'CREATE TABLE reddit_rainbow_raw (' + 
                'id                      SERIAL PRIMARY KEY,' +
                'comment_id              VARCHAR(100) NOT NULL,' +
                'created_utc             integer NOT NULL,' + 
                'color                   VARCHAR(100) NOT NULL,' +
                'subreddit_display_name  VARCHAR(100) NOT NULL' +
                ');';
const insertRowQuery = 'INSERT INTO reddit_rainbow_raw (comment_id, created_utc, color, subreddit_display_name) VALUES ($1, $2 ,$3 ,$4);';


// Heroku Port or Local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {res.send("Hello World!")})

app.get("/reset_table", (req, res, next) => {
    client.query(dropTableQuery, function(err){
        client.query(createTableQuery, function(err){
          console.log('Table Reset');
        })
      });
   });

app.post("/pybot_data", basicAuth({
    users,
    unauthorizedResponse: "valid credentials required"}), (req, res, next) => {
        var {comment_id, created_utc, color, subreddit_display_name} = req.body;
        client.query(insertRowQuery, [comment_id, created_utc, color, subreddit_display_name], (err, result) => {
            if(err){
                next(err)
                return
            };
          })
        res.json(req.body)
        console.log(req.body)
   });


// 404 and 500 routes
app.use(function(req,res){
  res.status(404);
  res.render("404");
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render("500");
});
