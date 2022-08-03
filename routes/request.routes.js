require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;

router.get("/", (req, res, next) => {
    res.render("request/request");
    next();
});

module.exports = router;