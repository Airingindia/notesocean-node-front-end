var express = require('express');
var router = express.Router();
const path = require('path');
const homeControllers = require('../controllers/home.controller');
const profileControllers = require("../controllers/profile.controller");
const urlMaker = require("../services/url.services");
const timeService = require('../services/time.services');
const req = require('express/lib/request');
const productControllers = require("../controllers/product.controller");
const collectionController = require('../controllers/collection.controller');

// homepage route
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
});

// notes page route

router.get("/notes/:id", async (req, res, next) => {
  const product = await productControllers.getInfo(req.params.id);
  if (product.product !== null) {
    const userData = await profileControllers.getInfo(product.product.userId);
    if (userData.id) {
      res.render("view-products", {
        data: product.product, timeService: timeService, user: userData
      });
    } else {
      res.render("view-products", {
        data: product.product, timeService: timeService, user: {
          fistName: "Notes",
          lastName: "Ocean",
          profileImage: "/images/logo.png",
          id: ""
        }
      });
    }
    // console.log(product);
  } else {
    res.status(404);
    res.render("notfound");
  }
});

// profile page routes

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
    res.status(404);
    res.render("notfound");
  }
});

// collection page route

router.get("/collection/:collecton_id", async (req, res, next) => {
  let collecton_id = req.params.collecton_id;
  if (!isNaN(collecton_id)) {
    const collection = await collectionController.getCollection(collecton_id);
    if (collection.id) {
      const userInfo = await profileControllers.getInfo(collection.userId);
      res.render("collection", {
        collection: collection,
        timeService: timeService,
        user: userInfo
      });
    } else {
      res.status(404);
      res.render("notfound");
    }
  } else {
    res.status(404);
    res.render("notfound");
  }
});

// other pages routes
// search page route

router.get("/search", (req, res, next) => {
  const query = req.query.query;
  console.log(query);
  res.render("search");
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
