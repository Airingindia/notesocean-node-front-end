var express = require('express');
var router = express.Router();
const pagecrypt = require('../services/pagecrypt.services');

router.get('/', async function (req, res, next) {
    const file = await pagecrypt("../views/dashboard/dashboard.html");
    res.send(file);
});

module.exports = router;
