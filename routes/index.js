var express = require('express');
var router = express.Router();

const config = require('../bin/config.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NewsCloud' });
});

module.exports = router;
