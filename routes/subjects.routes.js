require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
const fs = require('fs');
const subjects = require("./subject.json");
const url = require("./../services/url.services.js");
const productControllers = require("../controllers/product.controller");
const timeService = require('../services/time.services');
const bytesToMbService = require('../services/bytesToMb.services');

router.get('/', async function (req, res, next) {
    res.render("subjects/all-subjects.pug", {
        subjects: subjects,
        url: url
    });
});


router.get("/:subject", (req, res, next) => {
    productControllers.searchProducts(req.params.subject).then((product) => {
        res.render("subjects/view-subject", {
            data: product,
            time: timeService,
            subject: req.params.subject ,
            bytesToMb: bytesToMbService
        });
    }).catch((err) => {
        res.status(404);
        res.render("notfound");

    })
})


module.exports = router;
