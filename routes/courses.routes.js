var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.render("courses/all-courses.pug");
});

router.get('/all', async function (req, res, next) {
    res.render("courses/all-courses.pug");
});


module.exports = router;
