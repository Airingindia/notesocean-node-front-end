const express = require('express');

const router = express.Router();


router.get('/', async function (req, res, next) {
    res.render("dashboard/quick-notes/my-quick-notes", {
        url: req.originalUrl
    });
});

router.get('/new', async function (req, res, next) {
    res.render("dashboard/quick-notes/create-quick-notes", {
        url: req.originalUrl
    });
})

module.exports = router;