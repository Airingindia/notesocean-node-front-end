require("dotenv").config();
var express = require('express');
var router = express.Router();
const path = require('path');
const env = process.env.ENV;

/* GET home page. */
router.get('/', function (req, res, next) {
    if (env == "development") {
        const envdata = {
            env: env,
            home: "http://localhost:3000",
            api: "http://localhost:8081"
        };
        res.json(envdata);
    } else {
        const envdata = {
            env: env,
            home: "https://notesocean.com",
            api: "https://api.notesocean.com"
        };
        res.json(envdata);
    }

});

module.exports = router;
