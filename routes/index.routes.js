const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/home.controller');
const profileControllers = require("../controllers/profile.controller");
const urlMaker = require("../services/url.services");
const timeService = require('../services/time.services');
const productControllers = require("../controllers/product.controller");
const collectionController = require('../controllers/collection.controller');
const socketServices = require("../services/socket.services");
const liveControlllers = require("../controllers/live.controllers");
const api_url = process.env.API_URL;

// homepage route
router.get('/', function (req, res, next) {
  homeControllers.getFeed().then((data) => {
    res.render("index",
      {
        data: data,
        getTime: timeService,
        url: urlMaker
      }
    );
  }).catch((error) => {
    console.log(error);
  })
});

// notes page route



router.get("/notes/:id", (req, res, next) => {
  var token = "";
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // productControllers.getInfo(req.params.id, token).then((product) => {
  //   profileControllers.getInfo(product.product.userId).then((userData) => {
  //     res.render("view-products", {
  //       data: product, timeService: timeService, user: userData, api: api_url
  //     });
  //     next();
  //   }).catch((error) => {
  //     const userData = {
  //       id: 0,
  //       firstName: "Notes",
  //       lastName: "Ocean",
  //       profileImage: "/images/dummy/user_dummy.jpg",
  //     }
  //     res.render("view-products", {
  //       data: product, timeService: timeService, user: userData, api: api_url
  //     });
  //     next();
  //   });
  // }).catch((error) => {
  //   res.render("notfound");
  //   next();
  // })


  productControllers.getInfo(req.params.id, token).then((product) => {
    const userData = {
      id: 0,
      firstName: "Notes",
      lastName: "Ocean",
      profileImage: "/images/dummy/user_dummy.jpg",
    }
    res.render("view-products", {
      data: product, timeService: timeService, user: userData, api: api_url
    });
  }).catch((error) => {
    res.render("notfound");
    next();
  })
});

// profile page routes

router.get("/profile/:user_id", async (req, res, next) => {
  let user_id = req.params.user_id;
  if (!isNaN(user_id)) {
    profileControllers.getInfo(user_id).then((userInfo) => {
      res.render("profile", {
        profile: userInfo
      });
      next();
    }).catch((error) => {
      res.render("notfound");
      next();
    })
  } else {

    res.render("notfound");
    next();
  }
});

// collection page route

//  login page route
router.get("/login", (req, res, next) => {
  res.render("account/login");
});

// sign page route 

router.get("/signup", (req, res, next) => {
  res.render("account/signup");
});

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
      res.render("notfound");
    }
  } else {
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
