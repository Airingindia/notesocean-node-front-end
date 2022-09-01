var express = require('express');
var router = express.Router();
require("dotenv").config();
const api_url = process.env.API_URL;
const productControllers = require("../controllers/product.controller");
const timeService = require('../services/time.services');
const url = require("./../services/url.services.js");
const courses = require("./courses.json");

router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.render("courses/all-courses.pug", {
        courses: courses,
        url: url
    });
});

router.get("/:course", (req, res, next) => {
    productControllers.searchProducts(req.params.course.replace("-", " ")).then((product) => {
        res.render("courses/view-course", {
            data: product,
            time: timeService,
            course: req.params.course
        });

    }).catch((err) => {
        console.log(err);
        res.status(404);
        res.render("notfound");
    })
});


module.exports = router;
