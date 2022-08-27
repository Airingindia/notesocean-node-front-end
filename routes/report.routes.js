var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.render("report/new");
});
router.get('/:id', async function (req, res, next) {
    res.render("report/new", {
        id: req.params.id
    });
});


module.exports = router;