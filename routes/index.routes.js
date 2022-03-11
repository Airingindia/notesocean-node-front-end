var express = require('express');
var router = express.Router();
const path = require('path');
const homeControllers = require('../controllers/home.controllers');
const profileControllers = require("../controllers/profile.controller");
const urlMaker = require("../services/url.services");
const timeService = require('../services/time.services');
const req = require('express/lib/request');
/* GET home page. */
// app.locals.getActualTime = timeService.get
router.get('/', async function (req, res, next) {
  await homeControllers.getFeed().then((data) => {
    res.render("index",
      {
        data: data,
        getTime: timeService,
        url: urlMaker
      }
    );
  });
  // res.renderAsynchronous("index");
});

router.get("/notes/:id", async (req, res, next) => {
  res.render("view-products");
  console.log("id", req.params.id);
});

router.get("/profile/:user_id", async (req, res, next) => {
  let user_id = req.params.user_id;
  if (!isNaN(user_id)) {
    const userInfo = await profileControllers.getInfo(user_id);
    if (userInfo.exception) {
      res.status(404);
      res.render("notfound");
    } else {
      res.render("profile", {
        profile: userInfo
      });
    }
  } else {
    res.render("notfound");
  }
});

router.get("/privacy-policies", (req, res, next) => {
  res.render("information-pages/privacy");
});

router.get("/terms-and-condition", (req, res, next) => {
  res.render("information-pages/terms");
});

router.get("/about-us", (req, res, next) => {
  res.render("information-pages/about");
});

router.get("/contact-us", (req, res, next) => {
  res.render("information-pages/contact");
});

router.get("/contact-us/success", (req, res, next) => {
  res.render("information-pages/contact-success");
});

router.get("/contact-us/error", (req, res, next) => {
  res.render("information-pages/contact-error");
});

router.get("/session-expire", (req, res, next) => {
  res.render("session-expire");
});



module.exports = router;
