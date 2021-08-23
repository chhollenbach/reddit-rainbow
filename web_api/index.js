const express = require("express");
var app = express();
var cors = require('cors');
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
const dropRedditRaw = 'DROP TABLE IF EXISTS reddit_rainbow_raw';
const createRedditRaw = 'CREATE TABLE reddit_rainbow_raw (' + 
                'id                      SERIAL PRIMARY KEY,' +
                'comment_id              VARCHAR(100) NOT NULL,' +
                'created_utc             INTEGER NOT NULL,' + 
                'color                   VARCHAR(100) NOT NULL,' +
                'subreddit_display_name  VARCHAR(255) NOT NULL,' +
                'body                    VARCHAR NOT NULL,' +
                'score                   INTEGER NOT NULL'   +  
                ');';
const insertRowQuery = 'INSERT INTO reddit_rainbow_raw (comment_id, created_utc, color, subreddit_display_name, body, score) VALUES ($1, $2 ,$3 ,$4, $5, $6);';
const getNColorCountBySubreddit = 'SELECT subreddit_display_name, COUNT(*) AS subreddit_count FROM reddit_rainbow_raw WHERE color = $1 GROUP BY subreddit_display_name ORDER BY 2 DESC LIMIT $2'
const getNMostRecentColorRows = 'SELECT * FROM reddit_rainbow_raw WHERE color = $1 ORDER BY created_utc DESC LIMIT $2'
const getNTopColorScores = 'SELECT * FROM reddit_rainbow_raw WHERE color = $1 ORDER BY score DESC LIMIT $2'
const getTotalColorCounts = 'SELECT color, COUNT(id) FROM reddit_rainbow_raw GROUP BY 1 ORDER BY 2 DESC'
const getAllRows = 'SELECT * from reddit_rainbow_raw ORDER BY created_utc ASC'
const getSpecificComment = 'SELECT * from reddit_rainbow_raw WHERE comment_id = $1 and id = $2'
const updateScore = 'UPDATE reddit_rainbow_raw SET score = $1 WHERE comment_id = $2 and id = $3'
const deleteCommentData = 'DELETE from reddit_rainbow_raw WHERE comment_id = $1 and id = $2'


// Heroku Port or Local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// TESTING ROUTES
// app.get("/", (req, res, next) => {
//   res.send("Hello World")
//  });

// app.get("/drop_reddit_raw", (req, res, next) => {
//    client.query(dropRedditRaw, function(err){
//         console.log('reddit_rainbow_raw dropped')
//         res.send('reddit_rainbow_raw dropped')
//       });
//    });

// app.get("/create_reddit_raw", (req, res, next) => {
//     client.query(createRedditRaw, function(err){
//           console.log('reddit_rainbow_raw created')
//           res.send('reddit_rainbow_raw created')
//         });
//     });


// GET ROUTES
// N comments of specified color sorted by score descending
app.get('/:limit/:specific_color/scores', cors(), (req, res, next) => {
  client.query(getNTopColorScores, [req.params.specific_color, req.params.limit], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});

// N comments of specified color sorted by recency descending
app.get('/:limit/:specific_color/recent', cors(), (req, res, next) => {
  client.query(getNMostRecentColorRows, [req.params.specific_color, req.params.limit], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});

// Grouping by subreddit, N counts of specific color, sorted by count descending
app.get('/:limit/:specific_color/subreddit_groupings/', cors(), (req, res, next) => {
  client.query(getNColorCountBySubreddit, [req.params.specific_color, req.params.limit], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});

// Total color counts for all colors
app.get('/color_counts/', cors(), (req, res, next) => {
  client.query(getTotalColorCounts, (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});

// returns all rows, oldest first, used by python script to update score/delete comments
app.get('/all_rows/', cors(), (req, res, next) => {
  client.query(getAllRows, (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});

// returns specific comment by comment id and row id
app.get('/comment_by_id/:comment_id/:id', cors(), (req, res, next) => {
  client.query(getSpecificComment, [req.params.comment_id, req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
});


// PUT ROUTES
// Update score for given comment id and row id
app.put("/new_score/:score/at/:comment_id/:id", basicAuth({
  users,
  unauthorizedResponse: '401 Invalid credentials'}), 
  (req, res, next) => {
      client.query(updateScore, [req.params.score, req.params.comment_id, req.params.id], (err, result) => {
          if(err){
              return next(err)
          };
        })
      res.json(req.params)
 });

// DELETE ROUTES
// delete comment data at given comment/row id 
app.delete("/comment_by_id/:comment_id/:id", basicAuth({
  users,
  unauthorizedResponse: '401 Invalid credentials'}), 
  (req, res, next) => {
      client.query(deleteCommentData, [req.params.comment_id, req.params.id], (err, result) => {
          if(err){
              return next(err)
          };
        })
      res.json(req.params)
 });


// POST ROUTES
app.post("/pybot_data", basicAuth({
    users,
    unauthorizedResponse: '401 Invalid credentials'}), 
    (req, res, next) => {
        var {comment_id, created_utc, color, subreddit_display_name, body, score} = req.body;
        client.query(insertRowQuery, [comment_id, created_utc, color, subreddit_display_name, body, score], (err, result) => {
            if(err){
                return next(err)
            };
          })
        res.json(req.body)
   });


// 404 and 500 routes
app.use(function(req,res){
  res.status(404).json({error: "404 Not Found"});
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).json({error: "500 Internal server error"});
});