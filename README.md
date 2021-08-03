# The Rainbow in Reddit
A full stack side project. The various pieces:

- Python bot using PRAW to scrape Reddit comments for any comments containing colors. These sent via POST to the Node.js API
- Node.js API that is connected to a PostgreSQL database
- PostgreSQL Database that stores the scraped color data
- Front-end site using React to visualize the data and interact with the API

All the pieces are hosted using Heroku
