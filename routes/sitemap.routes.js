var express = require('express');
var router = express.Router();
var productControllers = require('../controllers/product.controller');
var homeControllers = require('../controllers/home.controller');
/* GET login and signup  page. */

router.get('/', async function (req, res, next) {
    res.render("account/signup");
});

router.get('/sitemap.xml', async function (req, res, next) {
    var cate = ["/", "/contact-us", "/about-us", "/privacy-policies", "/login", "/dashboard/public-notes/new", "/dashboard", "/search", "/search.xml", "/upload", "/upload", "/sitemaps/notes.xml", "/sitemaps/profile.xml", "/profile", "/terms-and-condition", "/dashboard/profile", "/signup", "/account/login", "/account/signup", "/recent-notes", "sitemaps/recent-notes.xml", "/sitemaps/most-viewed.xml", "/sitemaps/top-profile.xml", "/top-profile"];
    var host = req.get("host");
    var data = {
        cate: cate,
        host: host
    }
    res.contentType("application/xml");
    res.render("sitemaps/sitemap", {
        data: data
    });
    console.log(req.get("host"));
});

router.get('/recent-notes.xml', (req, res, next) => {

    homeControllers.getFeed().then((response) => {
        res.contentType("application/xml");
        var host = req.get("host");
        res.render("sitemaps/recent-notes", {
            host: host,
            data: response
        });
    }).catch((error) => {
        res.contentType("text/html");
        res.render("notfound");
    })
    // res.send("okay");
});

module.exports = router;
