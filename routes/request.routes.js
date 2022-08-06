require("dotenv").config();
var express = require('express');
var router = express.Router();
const api_url = process.env.API_URL;
const requestController = require("../controllers/request.controller");
router.get("/", (req, res, next) => {
    res.render("request/request");
});

router.get("/new", (req, res, next) => {
    let loggedin = true;
    if (req.cookies.token != undefined || req.cookies.token != null) {
        loggedin = false;
    }
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