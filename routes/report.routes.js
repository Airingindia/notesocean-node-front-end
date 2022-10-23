var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.render("report/new");
});

router.get("/success", (req, res) => {
    res.render("information-pages/contact-success", {
        title: "Report"
    });
});



router.get('/:id', async function (req, res, next) {
    res.render("report/new", {
        id: req.params.id
    });
});


module.exports = router;