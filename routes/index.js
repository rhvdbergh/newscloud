var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  
  T.get('search/tweets', { q: `news`, count: 1000 }, function(err, data, response) {
    
    let str = '';

    data.statuses.forEach(tweet => {

      str += tweet.text;
    });

    str = wordsOnly(str);

    str = sw.removeStopwords(str.split(' ')).join(' ');
    str = sw.removeStopwords(str.split(' '), ['t', 'co', 'http', 'https', 'rt', 's', 'news']).join(' ');

    
    const tweetsObject = countWords(str, true);
    const tweetsUnsorted = Object.entries(tweetsObject);

    const tweets = tweetsUnsorted.sort((a, b) => {
      return b[1] - a[1];
    }).slice(0, 29);

    console.log(tweets);

    let news = [['foo', 12], ['bar', 6]];

    res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
  });

});


module.exports = router;
