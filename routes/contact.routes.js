var express = require('express');
var router = express.Router();

/* GET login and signup  page. */

router.get('/', async function (req, res, next) {
    res.redirect("/contact-us");
});

module.exports = router;
