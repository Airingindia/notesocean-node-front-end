const express = require('express');
const router = express.Router();
const path = require('path');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render("index");
});

router.post('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: "okay"
    })
});

router.put("/", function (req, res, next) {
    res.status(200);
    res.json({
        message: "put method not allowed!"
    })
})

module.exports = router;