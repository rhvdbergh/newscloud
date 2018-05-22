var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const SearchTerm = require('../models/searchTerm');

// const config = require('../bin/config.js');

const request = require('request'); // works like fetch(), but easier to set custom headers 

// to-source is is needed to pass the array as a normal string - but as source code, 
// so toString() does not work (result of toString() on arrays = csv)
const toSource = require('to-source'); 

const Twit = require('twit');

const twitOptions = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const T = new Twit(twitOptions);

const countWords = require('count-words'); // use: countWords(string, boolean_ignore_case)
// stopword takes an array, removes common words, and returns an array
// can also take a user defined list of words, passed as an array as second parameter
const sw = require('stopword'); 
const stopwordList = require('../bin/word_list.js');
const TextCleaner = require('text-cleaner');

// HELPER METHODS //

// helper method to clean data in string
// first parameter is the string to be cleaned
// second parameter is custom words to remove from string, in the form of an array
function sanitizeStr(str, removeWords) {

    let newStr = TextCleaner(str)
      .toLowerCase()
      .trim()
      .stripEmails()
      .stripHtml()
      .removeChars({ replaceWith: ' ', exclude: "'"})
      .condense()
      .valueOf();

    // remove single letters and two letter words
    newStr = newStr.split(' ').map(word => { 
      if (word.length > 2) return word;
    }).join(' ');

    // remove introduced whitespace
    newStr = TextCleaner(newStr).condense().valueOf();

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
  res.redirect('/random/search');
});

/* GET search page. */
router.get('/:searchTerm', function(req, res, next) {

  let searchTerm = req.params.searchTerm;
  
  // update the MongoDB newscloud entry for this search term, or create if necessary
  if (searchTerm !== 'favicon.ico') {  // if GET /favicon.ico, just ignore and skip forward
    SearchTerm.findOne({ searchTerm: searchTerm }, null, {}, (err, term) => {

      if (err) {
        next(err);
      };

      if (term) { // there is already an instance of the search term in the db
        let date = new Date();
        term.count++;
        term.lastUpdated = date;
        term.save();
      } else { // create a new entry in the db for this search term
        SearchTerm.create({ searchTerm: searchTerm });
      }
    });
  }

  // retrieve tweets
  T.get('search/tweets', { q: searchTerm, count: 100 }, function(err, data, response) {
    
    if (err) {
      err.message = 'Error retrieving tweets: ' + err.message;
      console.log(err.message);
      next(err);
    }

    let twitStr = '';
    data.statuses.forEach(tweet => {
      twitStr += tweet.text;
    });
    const tweets = sanitizeStr(twitStr, [searchTerm]);

    // prepare to retrieve news headlines and summaries
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const options = {
      url: `https://newsapi.org/v2/everything?q=${searchTerm}&pageSize=100&from=${weekAgo.toISOString()}$sortBy=relevancy`,
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY 
      }
    }
  
    // retrieve news headlines and summaries
    request(options, (err, response, body) => {
      if (err) { 
        err.message = 'Error retrieving news headlines and summaries: ' + err.message;
        console.log(err.message);
        next(err);
      }

      data = JSON.parse(body);
  
      if (data.status === "error" && data.code === "rateLimited") {
        let err = new Error("NewsCloud has exceed its rate limit for the News API. Please try again later.");
        let newsStr = 'Unfortunately, no news today. Unfortunately, too, no news is bad news in this case ... the News API rate limit has been exceeded for this web app.';
        next(err);
      } 
        let newsStr = '';
        data.articles.forEach(article => {
          newsStr += article.title;
          newsStr += article.description;
        });
        const news = sanitizeStr(newsStr, [searchTerm]);
      // } // end else
  
    //retrieve latest searches
    let latest = [];
    SearchTerm.find().sort({ field: 'asc', lastUpdated: -1 }).limit(20)
      .then(terms => {
          terms.forEach(term => {
            latest.push({ term: term.searchTerm, count: term.count });
          });
        })  
        .then(() => {
          // render the results to the page
          res.render('index', { 
            news: toSource(news), 
            tweets: toSource(tweets),
            latest: latest,
            searchTerm: searchTerm,
            buttonTitle: 'About' });
        });
      });
    });
});

/* GET about/info page. */
router.get('/about/info', (req, res, next) => {

  res.render('about', { buttonTitle: 'Random Search' });
});

/* GET random/search page */
router.get('/random/search', (req, res, next) => {

  // pick random letters
  const rndLtrs = "abcdefghijklmnoprstuvwy";
  const rndLtrA = rndLtrs[Math.floor(Math.random() * 23)];
  const rndLtrB = rndLtrs[Math.floor(Math.random() * 23)];

  // pick a random number of letters between rndLtrA and B
  const rndNum = 2 + Math.floor(Math.random() * 4);
  let wildcards = '';
  for (let i=0; i <= rndNum; i++) {
    wildcards += '?';
  }

  // use the datamuse api to retrieve a random word
  request({url: `https://api.datamuse.com/words?sp=${rndLtrA}${wildcards}${rndLtrB}&max=1`}, (err, response, body) => {
    if (err) { 
      err.message = 'Error retrieving random word: ' + err.message;
      console.log(err);
      next(err);
    }

    data = JSON.parse(body);

    res.redirect(`/${data[0].word}`);
  });
});

module.exports = router;
