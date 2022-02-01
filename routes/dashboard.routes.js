var express = require('express');
var router = express.Router();
const pagecrypt = require('../services/pagecrypt.services');

router.get('/', async function (req, res, next) {
    res.render("dashboard/dashboard");
    // console.log(req.pages);
});

router.get('/:page', async function (req, res, next) {
    var alias = req.params.page;
    if (alias == "my-notes") {
        res.render("dashboard/my-notes");
    } else if (alias == "profile") {
        res.render("dashboard/profile");
    }
    else if (alias == "create-notes") {
        res.render("dashboard/create-notes");
    }
    else if (alias == "upload-note") {
        res.render("dashboard/upload-note");
    }
});

module.exports = router;
