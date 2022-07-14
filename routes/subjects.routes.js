require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;

const productControllers = require("../controllers/product.controller");
const timeService = require('../services/time.services');
router.get('/', async function (req, res, next) {
    res.render("subjects/all-subjects.pug");
    next();
});

router.get('/all', async function (req, res, next) {
    res.render("subjects/all-subjects.pug");
    next();
});

router.get("/:subject", (req, res, next) => {
    productControllers.searchProducts(req.params.subject).then((product) => {
        if (product.size !== 0) {
            res.render("subjects/view-subject", {
                data: product,
                time: timeService,
                subject: req.params.subject
            });
            next();
        } else {
            res.status(404);
            res.render("notfound");
            next();
        }

    }).catch((err) => {
        res.status(404);
        res.render("notfound");
        next();
    })
})


module.exports = router;
