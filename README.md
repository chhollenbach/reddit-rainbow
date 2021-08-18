# The Rainbow in Reddit
Created as a fun full stack learning project that aims to celebrate and explore all the color in Reddit comments. Any comment that contains a color of the rainbow is stored and later displayed in a React app. In a world that's gone through a LOT in the past year and a half, hopefully this project can shine a little bit of light and color on your day.

Technical Pieces:
- Python bot using PRAW to scrape Reddit comments for any comments containing colors. Uses a queue to batch POST requests to node server every 8 hours
- Node.js API that serves to update a PostgreSQL database and retrieve data for the React app (and anyone else wanting to make a GET request to it)
- React front-end to visualize the stored data and interact with the API

All the pieces are hosted using Heroku
