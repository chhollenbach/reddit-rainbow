const express = require("express");
var app = express();
const basicAuth = require('express-basic-auth')
const dotenv = require('dotenv').config();

// secure creds for POST to DB
const user = process.env.USER;
const pass = process.env.PASS;
var users = {};
users[user] = pass;

app.listen(3000, () => {
 console.log("Server running on port 3000: http://localhost:3000");
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res, next) => {
    res.json({message: 'hello world! Reddit rainbow API'})
   });

app.post("/pybot_data", basicAuth({
    users,
    unauthorizedResponse: "valid credentials required"}), (req, res, next) => {
            console.log(req.body)
            res.send(req.body)
   });
