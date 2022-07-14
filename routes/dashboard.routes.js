require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
router.get('/', async function (req, res, next) {
    res.render("dashboard/my-dashboard");
    next();
});

router.get('/:page', async function (req, res, next) {
    var alias = req.params.page;
    if (alias == "private-notes") {
        res.render("dashboard/private-notes/private-notes");
        next();
    }
    // profile
    else if (alias == "profile") {
        res.render("dashboard/profile/profile");
        next();
    }
    //  public notes
    else if (alias == "public-notes") {
        res.render("dashboard/public-notes/my-public-notes");
        next();
    }
    else if (alias == "collections") {
        res.render("dashboard/collections/my-collections");
        next();
    }
    else if (alias == "earning") {
        res.render("dashboard/earning/my-earning");
        next();
    }
    else {
        res.status(404);
        res.render("notfound");
        next();
    }
});

router.get("/:page/:parameter", (req, res, next) => {
    var alias = req.params.page;
    var parameter = req.params.parameter;
    if (alias == "collections" && !isNaN(parameter)) {
        res.render("dashboard/collections/colection-details");
        next();
    }
    else if (alias == "public-notes" && !isNaN(parameter)) {
        res.render("dashboard/public-notes/public-notes-details");
        next();
    }
    else if (alias == "public-notes" && parameter == "new") {
        res.render("dashboard/public-notes/upload-public-notes");
        next();
    }
    else if (alias == "public-notes" && parameter == "create") {
        res.render("dashboard/public-notes/create-public-notes");
        next();
    }
    else if (alias == "private-notes" && parameter == "new") {
        res.render("dashboard/private-notes/upload-private-notes");
        next();
    }
    else if (alias == "private-notes" && parameter == "create") {
        res.render("dashboard/private-notes/create-private-notes");
        next();
    }
    else if (alias == "private-notes" && !isNaN(parameter)) {
        res.render("dashboard/private-notes/private-notes-details");
        next();
    }

    else if (alias == "profile" && parameter == "verify-email") {
        res.render("dashboard/profile/verify/email/verify-email");
        next();
    }
    else if (alias == "profile" && parameter == "verified-email") {
        res.render("dashboard/profile/verify/email/email-verified");
        next();
    }
    else if (alias == "profile" && parameter == "verify-mobile") {
        res.render("dashboard/profile/verify/mobile/verify-mobile");
        next();
    }
    else if (alias == "profile" && parameter == "verified-mobile") {
        res.render("dashboard/profile/verify/mobile/mobile-verified");
        next();
    }
    else {
        res.status(404);
        res.render("notfound");
        next();
    }
});

module.exports = router;
