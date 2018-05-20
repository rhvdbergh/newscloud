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
const stopwordList = require('../bin/word_list.js');

// HELPER METHODS //

// helper method to clean data in string
// first parameter is the string to be cleaned
// second parameter is custom words to remove from string, in the form of an array
function sanitizeStr(str, removeWords) {

  let newStr = wordsOnly(str);

    // remove common English words 
    newStr = sw.removeStopwords(newStr.split(' ')).join(' ');
    // remove user defined words
    newStr = sw.removeStopwords(newStr.split(' '), [...removeWords, ...stopwordList]).join(' ');

    const obj = countWords(newStr, true);
    const unsorted = Object.entries(obj);

    const sorted = unsorted.sort((a, b) => {
      return b[1] - a[1];
    }).slice(0, 29); // returns top 30 results

    // multiply font size by 4 for better presentation
    const blowup = sorted.map(el => {
      return [el[0], el[1] * 4]
    });

  return blowup;
}

// ROUTES //

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/news');
});

/* GET search page. */
router.get('/:searchTerm', function(req, res, next) {
  
  let searchTerm = req.params.searchTerm;

  // retrieve tweets
  T.get('search/tweets', { q: searchTerm, count: 100 }, function(err, data, response) {
    
    let twitStr = '';
    data.statuses.forEach(tweet => {
      twitStr += tweet.text;
    });
    const tweets = sanitizeStr(twitStr, [searchTerm]);

    // prepare to retrieve news headlines and summaries
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    console.log(weekAgo.toISOString());
    const options = {
      url: `https://newsapi.org/v2/everything?q=${searchTerm}&pageSize=100&from=${weekAgo.toISOString()}$sortBy=relevancy`,
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
      const news = sanitizeStr(newsStr, [searchTerm]);

      // render the results to the page
      res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
    });
  });
});

module.exports = router;
