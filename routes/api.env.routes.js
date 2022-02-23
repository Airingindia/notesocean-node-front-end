require("dotenv").config();
var express = require('express');
var router = express.Router();
const path = require('path');
const env = process.env.ENV;
const api_url = process.env.API_URL;
const homepage = process.env.HOMEPAGE;

/* GET home page. */
router.get('/', function (req, res, next) {
    const envdata = {
        env: env,
        home: homepage,
        api: api_url
    };
    res.json(envdata);
});

module.exports = router;
