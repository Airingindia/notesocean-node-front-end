require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
const requestController = require("../controllers/request.controller");
const timeService = require("../services/time.services");
const guest = process.env.GUEST_TOKEN;
router.get("/", (req, res, next) => {
    requestController.getAll(req.cookies.token).then((requests) => {
        var data = []

        for (var i = 0; i < requests.requested.length; i++) {
            data.push({
                "@type": "ListItem",
                "position": i + 1,
                "name": requests.requested[i].subject,
                "item": `https://notesocean.com/request/${requests.requested[i].uuid}`
            })
        }
        res.render("request/request", {
            schema: data,
            requests: requests,
            time: timeService
        })
    }).catch((error) => {
        res.render("errors/500")
    })
});

router.get("/new", (req, res, next) => {
    if (req.cookies.token == undefined) {
        return res.redirect("/login?dest=" + req.originalUrl);
    }
    res.render("request/new-request.pug");
});

router.get("/:uuid", (req, res, next) => {
    let uuid = req.params.uuid;
    let token = req.cookies.token;
    let tokenData = JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString('ascii'));
    let Vieweruuid = tokenData.userUuid;
    requestController.get(uuid, token).then((response) => {
        if (response.users.profileImage == null) {
            response.users.profileImage = "/images/dummy/user_dummy.jpg";
        }
        console.log(response.users.profileImage);
        res.render("request/view-request.pug", {
            data: response,
            vieweruuid: Vieweruuid,
        });
    }).catch((error) => { console.log(error) })

});


module.exports = router;