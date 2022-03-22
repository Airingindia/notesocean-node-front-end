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
    } else if (alias == "profile") {
        res.render("dashboard/profile/profile");
    }

    else if (alias == "upload-private-notes") {
        res.render("dashboard/upload-private-notes");
    } else if (alias == "public-notes") {
        res.render("dashboard/public-notes/my-public-notes");
    } else if (alias == "upload-public-notes") {
        res.render("dashboard/upload-public-notes");
    } else if (alias == "collections") {
        res.render("dashboard/collections/my-collections");
    } else if (alias == "create-new-collections") {
        res.render("dashboard/collections/create-new-collections");
    }
    else if (alias == "colection-details") {
        res.render("dashboard/collections/colection-details");

    }
});

router.get("/:page/:parameter", (req, res, next) => {
    var alias = req.params.page;
    var parameter = req.params.parameter;
    if (alias == "colection-details") {
        res.render("dashboard/collections/colection-details");
    } else if (alias == "collections" && parameter == "new") {
        res.render("dashboard/collections/create-new-collections");
    }
    else if (alias == "collections" && !isNaN(parameter)) {
        res.render("dashboard/collections/colection-details");
    }
    else if (alias == "public-notes" && !isNaN(parameter)) {
        res.render("dashboard/public-notes/public-notes-details");
    }
    else if (alias == "public-notes" && parameter == "new") {
        res.render("dashboard/public-notes/upload-public-notes");
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
        // check user email is verified or not
        // if verified show verified page
        // else show verification page
        res.render("dashboard/profile/email-verified");
        // res.render("dashboard/profile/verify-email");
        // console.log(req.cookies.token);
    }


});

module.exports = router;
