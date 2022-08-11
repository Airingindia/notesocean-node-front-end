require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
const requestController = require("../controllers/request.controller");
const timeService = require("../services/time.services");
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
        console.log("error", error);
    })

        ;
});

router.get("/new", (req, res, next) => {
    let loggedin = true;
    console.log(req.cookies.token);
    res.render("request/new-request.pug", {
        isLoggedIn: loggedin
    });
});

router.get("/:uuid", (req, res, next) => {
    let uuid = req.params.uuid;
    let token = req.cookies.token;
    if (token == undefined) {
        res.redirect("/login?dest=/request/" + uuid);
    } else {
        requestController.get(uuid, token).then((response) => {
            console.log(response);
            if (response.users.profileImage == null) {
                response.users.profileImage = "/images/dummy/user_dummy.jpg";
            }
            console.log(response.users.profileImage);
            res.render("request/view-request.pug", {
                data: response
            });
        }).catch((error) => { console.log(error) })
    }

});


module.exports = router;