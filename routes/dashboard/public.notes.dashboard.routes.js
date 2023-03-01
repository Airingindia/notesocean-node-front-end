const express = require('express');

const router = express.Router();


router.get('/', async function (req, res, next) {
    if (req.cookies.token == undefined) {
        return res.redirect("/login?dest=" + req.originalUrl);
    }
    res.send("quick notes");
})

module.exports = router;