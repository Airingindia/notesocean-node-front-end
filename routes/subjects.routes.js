require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("subjects/all-subjects.pug");
});

router.get('/all', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("subjects/all-subjects.pug");
});


module.exports = router;
