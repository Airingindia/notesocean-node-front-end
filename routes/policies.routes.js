var express = require('express');
var router = express.Router();
router.get('/', async function (req, res, next) {
    res.send("about");
});

router.get('/payment', async function (req, res, next) {
    res.render("policies/payment");
});

module.exports = router;