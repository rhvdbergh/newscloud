var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {

  fetch('https://content.guardianapis.com/search?api-key=5d01b574-a525-43d4-8e09-7ee87215919a')
    .then(res => res.json())
    .then(json => res.render('index', { title: 'Guardian Headlines', news: json.response.results[0].webTitle }));
});

module.exports = router;
