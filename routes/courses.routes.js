var express = require('express');
var router = express.Router();
require("dotenv").config();
const api_url = process.env.API_URL;

router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("courses/all-courses.pug");
});

router.get('/all', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("courses/all-courses.pug");
});


module.exports = router;
