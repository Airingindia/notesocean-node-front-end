var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.render("subjects/all-subjects.pug");
});

router.get('/all', async function (req, res, next) {
    res.render("subjects/all-subjects.pug");
});


module.exports = router;
