var express = require('express');
var router = express.Router();
const path = require('path');
const pagecrypt = require('../services/pagecrypt.services');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render("index");
});

module.exports = router;
