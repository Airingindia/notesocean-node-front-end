var express = require('express');
var router = express.Router();
const pagecrypt = require('../services/pagecrypt.services');

/* GET login and signup  page. */

router.get('/:type', async function (req, res, next) {
    const type = req.params.type;
    if (type == "signup") {
        res.type("text/html");
        const file = await pagecrypt("../views/account/signup.html");
        res.send(file);
    } else if (type == "login") {
        res.type("text/html");
        const file = await pagecrypt("../views/account/login.html");
        res.send(file);
    }
});

router.get('/', async function (req, res, next) {
    res.redirect("/account/login");
});

module.exports = router;
