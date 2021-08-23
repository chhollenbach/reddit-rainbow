# The Rainbow in Reddit
Created as a fun full stack side project that aims to celebrate and explore all the color in Reddit comments. Any comment that contains a color of the rainbow is stored and later displayed in a React app. In a world that's gone through a LOT in the past year and a half, hopefully this project can shine a little bit of light and color on your day.


![](https://github.com/chhollenbach/reddit-rainbow/blob/main/public/reddit-rainbow-demo-pic.JPG?raw=true)


# Development
## Prerequisites
- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org)
- [Python](https://www.python.org/)
- [React](https://reactjs.org/)

## Building and Running
Run `npm install` to install server dependencies

Run `pip install -r requirements.txt` for python packages

To test development:

`node web_api/index.js` will launch the Node.js server at http://localhost:3000/

`npm start` will launch the React app at http://localhost:3000/

App is currently designed to be used with Heroku as a hosting platform for the API, web client, python bot, and database. Please visit their [website](https://www.heroku.com/) to learn more about hosting there. If the app is hosted locally or elsewhere, be aware that certain key variables were stored on Heroku as configuration variables and will need to be altered to work on a different solution.

# App Architecture Explanation
All componenest are hosted on Heroku. This app is a full-stack CRUD app built using the MVC design pattern. A Python bot scrapes reddit comments for any mention of the colors of the rainbow. When found, the comment and metadata are sent to a RESTful Node.js API posts the data to a postgreSQL database. This API is also responsible for updating or deleting the data as comments are re-examined using a utility python script to check for either a changed comment score or a deleted comment. The data is visualized using React.

# Change Log
## August 2021
App is live at https://reddit-rainbow-web-client.herokuapp.com/



&copy; 2021 Connor Hollenbach
