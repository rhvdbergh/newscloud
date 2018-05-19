var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');

const request = require('request'); // works like fetch(), but easier to set custom headers 

// to-source is is needed to pass the array as a normal string - but as source code, 
// so toString() does not work (result of toString() on arrays = csv)
const toSource = require('to-source'); 

const Twit = require('twit');
const T = new Twit(config.twitter);

const countWords = require('count-words'); // use: countWords(string, boolean_ignore_case)
const wordsOnly = require('words-only');
// stopword takes an array, removes common words, and returns an array
// can also take a user defined list of words, passed as an array as second parameter
const sw = require('stopword'); 

// HELPER METHODS //

// helper method to clean data in string
function sanitizeStr(str) {

  let newStr = wordsOnly(str);

    newStr = sw.removeStopwords(newStr.split(' ')).join(' ');
    newStr = sw.removeStopwords(newStr.split(' '), ['t', 'co', 'http', 'https', 'rt', 's', 'news']).join(' ');

    const obj = countWords(newStr, true);
    const unsorted = Object.entries(obj);

    const sorted = unsorted.sort((a, b) => {
      return b[1] - a[1];
    }).slice(0, 29);

  return sorted;
}

// ROUTES //

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // retrieve tweets
  T.get('search/tweets', { q: `news`, count: 1000 }, function(err, data, response) {
    
    let twitStr = '';
    data.statuses.forEach(tweet => {
      twitStr += tweet.text;
    });
    const tweets = sanitizeStr(twitStr);

    // prepare to retrieve news headlines and summaries
    const options = {
      url: `https://newsapi.org/v2/everything?q=news`,
      headers: {
        'X-Api-Key': config.newsApiKey
      }
    }
  
    // retrieve news headlines and summaries
    request(options, (err, response, body) => {
      if (err) { console.log(err) }
      data = JSON.parse(body);
  
      let newsStr = '';
  
      data.articles.forEach(article => {
        newsStr += article.title;
        newsStr += article.description;
      });
      const news = sanitizeStr(newsStr);
      
      // render the results to the page
      res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
    });
  });
});

module.exports = router;
