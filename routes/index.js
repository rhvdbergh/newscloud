var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');

// to-source is is needed to pass the array as a normal string - but as source code, 
// so toString() does not work (result of toString() on arrays = csv)
const toSource = require('to-source'); 

const Twit = require('twit');
const T = new Twit(config.twitter);

const countWords = require('count-words'); // use: countWords(string, boolean_ignore_case)

/* GET home page. */
router.get('/', function(req, res, next) {
  
  let news = [['foo', 12], ['bar', 6]];
  let tweets = [['tweet', 12], ['terrific', 6]];
  res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
});

/* GET twitter page. */
router.get('/twitter/', function(req, res, next) {

  T.get('search/tweets', { q: `news`, count: 100 }, function(err, data, response) {
    
    let str = '';

    data.statuses.forEach(tweet => {

      str += tweet.text;
    });
    const news = [];
    const tweets = Object.entries(countWords(str, true));
    res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
    // res.json(Object.entries(countWords(str, true)));
  });
});

module.exports = router;
