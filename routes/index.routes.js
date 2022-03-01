var express = require('express');
var router = express.Router();
const path = require('path');
const homeControllers = require('../controllers/home.controllers');
const urlMaker = require("../services/url.services");
const timeService = require('../services/time.services');
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

router.get("/:id/:products.html", (req, res, next) => {
  res.render("view-products");
  console.log("id", req.params.id);
  console.log("product", req.params.products);
})

module.exports = router;
