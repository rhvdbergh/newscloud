var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');
// to-source is is needed to pass the array as a normal string - but as source code, 
// so toString() does not work (result of toString() on arrays = csv)
const toSource = require('to-source'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  let news = [['foo', 12], ['bar', 6]];
  let tweets = [['tweet', 12], ['terrific', 6]];
  res.render('index', { title: 'NewsCloud', news: toSource(news), tweets: toSource(tweets) });
});

module.exports = router;
