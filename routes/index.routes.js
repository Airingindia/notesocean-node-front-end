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
const { route } = require('./notes.routes');
const api_url = process.env.API_URL;
// const encoded_api = Buffer.from(api_url).toString('base64');


// router.get("/test", (req, res, next) => {
//   res.render("test")
// })
router.get("/google-signin", (req, res, next) => {
  res.redirect(api_url + "/authenticate/google-sign-in");
})
// homepage route
router.get('/', function (req, res, next) {
  res.render("index", {
    home: req.originalUrl
  });
});

router.get("/upload", (req, res, next) => {
  if (req.cookies.token == undefined) {
    return res.redirect("/login?dest=" + req.originalUrl);
  }
  res.redirect("/dashboard/public-notes/new");
});

router.get("/upload/:uuid", (req, res, next) => {
  if (req.cookies.token == undefined) {
    return res.redirect("/login?dest=" + req.originalUrl);
  }
  res.render("dashboard/public-notes/upload-public-notes");
});

// router.get("/:id/:name.pdf", (req, res, next) => {
//   var token = "";
//   if (req.cookies.token) {
//     token = req.cookies.token;
//   }
//   var deviceId = req.cookies.ampuser;
//   productControllers.getInfo(req.params.id, token).then((product) => {
//     const userData = {
//       id: 0,
//       firstName: "Notes",
//       lastName: "Ocean",
//       profileImage: "/images/dummy/user_dummy.jpg",
//     }
//     res.render("notes/view-notes", {
//       data: product, timeService: timeService, user: userData, api: api_url
//     });
//     ;
//     productControllers.addViews(product.product.id, token, deviceId).then((response) => {
//       console.log(response);
//       ;
//     });
//   }).catch((error) => {
//     res.render("notfound");
//     ;
//   });
// });

// profile page routes

router.get("/profile/:user_id", async (req, res, next) => {
  let user_id = req.params.user_id;
  if (user_id.length > 10) {
    profileControllers.getInfo(user_id).then((userInfo) => {
      // console.log(userInfo);
      if (userInfo.profileImage == null) {
        userInfo.profileImage = "https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com/user.png";
      }
      res.contentType("text/html");
      res.render("profile", {
        profile: userInfo
      });
      ;
    }).catch((error) => {
      console.log(error);
      res.status(404);
      res.render("notfound");
      ;
    })
  } else {
    res.status(404);
    res.render("notfound");
    ;
  }
});

// collection page route

//  login page route
router.get("/login", (req, res, next) => {
  res.render("account/login");
  ;
});

// sign page route 

router.get("/signup", (req, res, next) => {
  res.render("account/signup");
  ;
});

router.get("/collections/:collecton_id", async (req, res, next) => {
  let collecton_id = req.params.collecton_id;
  collectionController.getCollectionDetails(collecton_id).then((collection) => {
    var jsonld = [];
    for (var i = 0; i < collection.products.length; i++) {
      let temp = {
        "@type": "ListItem",
        "position": `"${i + 1}"`,
        "name": `"${collection.products[i].name}"`,
        "item": `"https://notesocean.com/notes/${collection.products[i].id}"`
      };
      jsonld.push(temp);
    }
    res.render("collection", {
      collection: collection,
      timeService: timeService,
      jsonld: JSON.stringify(jsonld)
    });
    ;

  }).catch((error) => {
    console.log(error);
    res.status(404);
    res.render("notfound");
    ;
  })
});

// other pages routes
// search page route

router.get("/search", (req, res, next) => {
  ;
  const query = req.query.query;
  if (query.length > 1) {
    productControllers.searchProducts(query).then((product) => {
      res.render("search", {
        data: product,
        query: query,
        time: timeService,
      });
      ;
    }).catch((err) => {
      console.log(err);
      if (err.statusCode == 429) {
        res.render("information-pages/tomanyrequest")
      } else {
        res.status(404);
        res.render("notfound");
      }
      ;
    })
  } else {
    res.redirect("/");
    ;
  }

});

router.get("/privacy-policies", (req, res, next) => {
  res.render("information-pages/privacy");
  ;
});

router.get("/terms-and-condition", (req, res, next) => {
  res.render("information-pages/terms");
  ;
});

router.get("/about-us", (req, res, next) => {
  res.render("information-pages/about");
  ;
});

router.get("/contact-us", (req, res, next) => {
  res.render("information-pages/contact");
  ;
});

router.get("/contact-us/success", (req, res, next) => {
  res.render("information-pages/contact-success");
  ;
});

router.get("/contact-us/error", (req, res, next) => {
  res.render("information-pages/contact-error");
  ;
});

router.get("/session-expire", (req, res, next) => {
  if (req.cookies.token != undefined) {
    profileControllers.logout(req.cookies.token).then((response) => {
      console.log("user logout");
    }).catch((err) => {
      console.log(err);
    })

  }
  res.clearCookie("token");
  res.render("session-expire");
  ;
});

router.get("/logout", (req, res, next) => {
  if (req.cookies.token != undefined) {
    profileControllers.logout(req.cookies.token).then((response) => {
      console.log("user logout");
    }).catch((err) => {
      console.log(err);
    })
  }
  res.clearCookie("token");
  res.render("session-expire");
  ;
});
module.exports = router;
