var express = require('express');
var router = express.Router();
require("dotenv").config();
const api_url = process.env.API_URL;
const productControllers = require("../controllers/product.controller");
const timeService = require('../services/time.services');

router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("courses/all-courses.pug");
});

router.get('/all', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("courses/all-courses.pug");
});

router.get("/:course", (req, res, next) => {
    productControllers.searchProducts(req.params.course.replace("-", " ")).then((product) => {
        if (product.size !== 0) {
            res.render("courses/view-course", {
                data: product,
                time: timeService,
                course: req.params.course
            });
        } else {
            res.status(404);
            res.render("notfound");
        }

    }).catch((err) => {
        console.log(err);
        res.status(404);
        res.render("notfound");
    })
});


module.exports = router;
