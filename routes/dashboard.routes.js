var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.render("dashboard/my-dashboard");
    // console.log(req.pages);
});

router.get('/:page', async function (req, res, next) {
    var alias = req.params.page;
    if (alias == "private-notes") {
        res.render("dashboard/private-notes/private-notes");
    }
    // profile
    else if (alias == "profile") {
        res.render("dashboard/profile/profile");
    }
    //  public notes
    else if (alias == "public-notes") {
        res.render("dashboard/public-notes/my-public-notes");
    }
    else if (alias == "collections") {
        res.render("dashboard/collections/my-collections");
    }
    else if (alias == "earning") {
        res.render("dashboard/earning/my-earning");
    }
    else {
        res.status(404);
        res.render("notfound");
    }
});

router.get("/:page/:parameter", (req, res, next) => {
    var alias = req.params.page;
    var parameter = req.params.parameter;
    // if (alias == "collections" && parameter == "new") {
    //     res.render("dashboard/collections/create-new-collections");
    // }
    if (alias == "collections" && !isNaN(parameter)) {
        res.render("dashboard/collections/colection-details");
    }
    else if (alias == "public-notes" && !isNaN(parameter)) {
        res.render("dashboard/public-notes/public-notes-details");
    }
    else if (alias == "public-notes" && parameter == "new") {
        res.render("dashboard/public-notes/upload-public-notes");
    }
    else if (alias == "public-notes" && parameter == "create") {
        res.render("dashboard/public-notes/create-public-notes");
    }
    else if (alias == "private-notes" && parameter == "new") {
        res.render("dashboard/private-notes/upload-private-notes");
    }
    else if (alias == "private-notes" && parameter == "create") {
        res.render("dashboard/private-notes/create-private-notes");
    }
    else if (alias == "private-notes" && !isNaN(parameter)) {
        res.render("dashboard/private-notes/private-notes-details");
    }

    else if (alias == "profile" && parameter == "verify-email") {
        res.render("dashboard/profile/verify/email/verify-email");
    }
    else if (alias == "profile" && parameter == "verified-email") {
        res.render("dashboard/profile/verify/email/email-verified");
    }
    else if (alias == "profile" && parameter == "verify-mobile") {
        res.render("dashboard/profile/verify/mobile/verify-mobile");
    }
    else if (alias == "profile" && parameter == "verified-mobile") {
        res.render("dashboard/profile/verify/mobile/mobile-verified");
    }
    else {
        res.status(404);
        res.render("notfound");
    }
});

module.exports = router;
