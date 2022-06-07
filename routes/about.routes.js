var express = require('express');
var router = express.Router();

/* GET login and signup  page. */

router.get('/', async function (req, res, next) {
    res.render("about");
});

module.exports = router;
