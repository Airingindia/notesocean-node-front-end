var express = require('express');
var router = express.Router();
const pagecrypt = require('../services/pagecrypt.services');

/* GET login and signup  page. */

router.get('/:type', async function (req, res, next) {
    const type = req.params.type;
    if (type == "signup") {
        res.render("account/signup");
    } else if (type == "login") {
        res.render("account/login");
    }
});

router.get('/', async function (req, res, next) {
    res.redirect("/account/login");
});

module.exports = router;
