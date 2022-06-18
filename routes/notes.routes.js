var express = require('express');
var router = express.Router();
const timeService = require('../services/time.services');
const productControllers = require("../controllers/product.controller");
const api_url = process.env.API_URL;

router.get('/', async function (req, res, next) {
    res.redirect("/");
});
router.get("/live-reading", (req, res, next) => {
    res.render("notes/live-reading");
});

router.get("/most-viewed", (req, res, next) => {
    productControllers.getMostViewedNotes().then((notes) => {
        res.render("notes/most-viewed", {
            notes: notes, timeService: timeService
        });
    }).catch((err) => {
        res.status(404).render("notfound");
    });


})

router.get("/:id", (req, res, next) => {
    if (!isNaN(req.params.id)) {
        var token = "";
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        var deviceId = req.cookies.ampuser;
        productControllers.getInfo(req.params.id, token).then((product) => {
            const userData = {
                id: 0,
                firstName: "Notes",
                lastName: "Ocean",
                profileImage: "/images/dummy/user_dummy.jpg",
            }
            res.render("notes/view-notes", {
                data: product, timeService: timeService, user: userData, api: api_url
            });
            next();
            productControllers.addViews(product.product.id, token, deviceId).then((response) => {
                console.log(response);
                next();
            });
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



module.exports = router;