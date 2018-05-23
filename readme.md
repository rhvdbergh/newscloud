# NewsCloud
An app to compare news headlines with Twitter through word clouds. 

## Public url
http://newzcloud.herokuapp.com

## Author
Ronald van der Bergh | https://github.com/rhvdbergh/newscloud | @ronaldvdb

## Description
This app compares news headlines and summaries of regular news headlines (provided by the awesome [News API](https://newsapi.org/)) with Twitter. The app draws word clouds based on the frequency of words found in the same headline, summary or tweet as a specific search term. Data goes back 7 days and is restricted to the latest 100 headlines + summaries and tweets. A news ticker at the bottom of the page shows the 20 most recent searches, as well as the number of times these terms were searched. (The words in the news ticker are clickable links)

NewsCloud is my capstone project for the [Treehouse Full Stack JavaScript Techdegree](https://teamtreehouse.com/techdegree/full-stack-javascript). It's built with Node.js, Express, MongoDB, Mongoose, Bootstrap, and jQuery. It uses several npm packages, but I'd like to give a special shout-out to the excellent [wordcloud2.js](https://www.npmjs.com/package/wordcloud) by Timothy Guan-tin Chien and [MARQUEE3000](MARQUEE3000) by Ezekiel Aquino. NewsCloud connects with three APIs (News API, Twitter, and Datamuse - the latter for retrieving random words).

## Treehouse rubric
The Treehouse expectations for this project follows below with a | to indicate how this project fulfills the requirement:
- App uses 2 APIs | App uses the News API API, Twitter API and Datamuse API.
- App properly displays data from APIs | The app receives data from these sources and displays this as two word clouds (or, in the case of the Datamuse API, performs a search on a random word)
- App is built using JS technologies like Node, Express, React, or the MEAN stack | The app is built using Node.js & Express, with several npm packages
- Student uses a framework, like Bootstrap, to style the front end of the app | The app uses Bootstrap 4
- App successfully uses a relational or document-based database | The app uses MongoDB
- App is deployed to a hosting service like Heroku, OpenShift, AWS, etc. | App is deployed on Heroku
- Final project is in a GitHub repository | https://github.com/rhvdbergh/newscloud
- Submits a public URL of the working app | http://newzcloud.herokuapp.com
- App runs successfully after running npm install and npm start in a local clone of the GitHub repository | It did so in my tests
- No syntax errors and the app starts successfully | It starts on my machine, and runs on Heroku (and on my phone and different browsers)

## Installation
- run `npm install` in the command line in the main directory of the app
- the latest Node.js version that this app was tested on: 8.10.0
- the latest MongoDB version tested is 3.6.4 (please ensure that MongoDB is installed)
- to run the app locally, a News API key is required. A free key can be obtained at https://newsapi.org/
- a twitter consumer key, consumer secret, access token and access token secret are required. These keys can be obtained by registering for a new app at https://apps.twitter.com/
- the app requires a config.js file that needs to be placed in the /bin directory. The config.js file should have the following structure:
``` 
module.exports = {
    twitter: {
        consumer_key: 'YOUR KEY HERE'
        consumer_secret: 'YOUR SECRET HERE',
        access_token: 'YOUR ACCESS_TOKEN HERE',
        access_token_secret: 'YOUR ACCESS_TOKEN_SECRET HERE'
    }, 
    newsApiKey: 'YOUR KEY HERE'
}
```
- to run the app, run `npm start` in the command line. 
- point to `localhost:3000` in a browser
