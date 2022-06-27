require("dotenv").config();
var express = require('express');
var router = express.Router();
const timeService = require('../services/time.services');
const productControllers = require("../controllers/product.controller");
const api_url = process.env.API_URL;

router.get('/', async function (req, res, next) {
    res.cookie("api", btoa(api_url));
    res.redirect("/");
});
router.get("/live-reading", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    res.render("notes/live-reading");
});

router.get("/most-viewed", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    productControllers.getMostViewedNotes().then((notes) => {
        res.render("notes/most-viewed", {
            data: notes, timeService: timeService
        });
    }).catch((err) => {
        res.status(404).render("notfound");
    });


})

router.get("/:id", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    if (!isNaN(req.params.id)) {
        var token = "";
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        productControllers.getInfo(req.params.id, token).then((product) => {
            res.render("notes/view-notes", {
                data: product, timeService: timeService, api: api_url
            });
            next();
            if (req.cookies.ampuser) {
                var deviceId = req.cookies.ampuser;
                productControllers.addViews(product.product.id, token, deviceId).then((response) => {
                    console.log(response);
                    next();
                }).catch((error) => {

                });
            }

        }).catch((error) => {
            console.log(error);
            res.render("notfound");

            next();
        });
    } else {
        res.status(404);
        res.render("notfound");
    }

});

router.get("/request/all", (req, res, next) => {
    backURL = req.header('Referer') || '/';
    // do your thang
    console.log(backURL);
})



module.exports = router;