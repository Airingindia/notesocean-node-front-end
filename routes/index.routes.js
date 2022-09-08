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
const url = require("./../services/url.services");
const subjects = require("./../routes/all-subject.json");
const courses = require("./../routes/all-courses.json");
// const encoded_api = Buffer.from(api_url).toString('base64');

router.get("/google-signin", (req, res, next) => {
  res.redirect(Buffer.from(req.cookies.api, "base64").toString("ascii") + "/authenticate/google-sign-in");
})
// homepage route
router.get('/', function (req, res, next) {
  res.render("index", {
    home: req.originalUrl,
    subjects: subjects,
    courses: courses,
    url: url
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
    profileControllers.getInfo(user_id, req).then((userInfo) => {
      if (userInfo.profileImage == null) {
        userInfo.profileImage = "/images/dummy/user_dummy.jpg";
      }
      else if (userInfo.profileImage.indexOf("'https://profiles.ncdn.in") == -1) {
        userInfo.profileImage = userInfo.profileImage.replace("https://profiles.ncdn.in", "https://profiles.ncdn.in/fit-in/100x100");
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

router.get("/login/:token",(req,res,next)=>{
  profileControllers.validateToken(req.params.token).then((response)=>{
   if(response.body){
      res.cookie("token",response.body.token);
      res.redirect("/dashboard");
   }else{
      res.redirect("/login");
   }
  }).catch((error)=>{
    res.redirect("/login");
  })
})
router.get("/login", (req, res, next) => {
  if (req.cookies.token != undefined) {
    return res.redirect("/dashboard");
  }
  res.render("account/login");
});

router.get("/reset-password", (req, res, next) => {
  res.render("account/reset");
})

// sign page route 

router.get("/signup", (req, res, next) => {
  if (req.cookies.token != undefined) {
    return res.redirect("/dashboard");
  }
  res.render("account/signup");
  ;
});

router.get("/collections/:collecton_id", async (req, res, next) => {
  let collecton_id = req.params.collecton_id;
  collectionController.getCollectionDetails(collecton_id, req).then((collection) => {
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
    res.status(404);
    res.render("notfound");
    ;
  })
});

// other pages routes
// search page route

router.get("/search", (req, res, next) => {
  const query = req.query.query;
  if (query.length > 1) {
    productControllers.searchProducts(query, req).then((product) => {
      res.status(200);
      res.render("search", {
        data: product,
        query: query,
        time: timeService,
      });
      ;
    }).catch((err) => {
      if (err.statusCode == 429) {
        res.render("information-pages/tomanyrequest")
      } else {
        res.render("notfound");
      }
    })
  } else {
    res.render("error/500");
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
    profileControllers.logout(req.cookies.token, req).then((response) => {
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
});
// support page route

router.get("/support", (req, res, next) => {
  res.render("information-pages/support");
});
module.exports = router;
