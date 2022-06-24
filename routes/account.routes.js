var express = require('express');
var router = express.Router();
require("dotenv").config();
/* GET login and signup  page. */
const api_url = process.env.API_URL;

router.get('/:type', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    const type = req.params.type;
    if (type == "signup") {
        res.render("account/signup");
    } else if (type == "login") {
        res.render("account/login");
    }
});

router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.redirect("/account/login");
});

module.exports = router;
