const express = require("express");
var app = express();
const basicAuth = require('express-basic-auth')

app.listen(3000, () => {
 console.log("Server running on port 3000: http://localhost:3000");
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res, next) => {
    res.json({message: 'hello world! Reddit rainbow API'})
   });

app.post("/pybot_data", basicAuth({
    users: {
        '': ''                          // Removed for github commit
        },
    unauthorizedResponse: "valid credentials required"}), (req, res, next) => {
            console.log(req.body)
            res.send(req.body)
   });
