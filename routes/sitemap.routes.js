var express = require('express');
var router = express.Router();
var productControllers = require('../controllers/product.controller');
var homeControllers = require('../controllers/home.controller');
const subjects = require("./subject.json");
const courses = require("./all-courses.json");
const url = require("./../services/url.services.js");
const requestController = require('../controllers/request.controller');
/* GET login and signup  page. */

router.get('/', async function (req, res, next) {
    res.redirect("/sitemaps/sitemap.xml");
});

router.get('/sitemap.xml', async function (req, res, next) {
    var cate = ["/contact-us", "/about-us", "/policies/privacy", "/login", "/dashboard/public-notes/new", "/dashboard",  "/upload","/terms-and-condition", "/dashboard/profile", "/signup", "/recent-notes", "/policies/payment", "/policies/payment/refund", "/policies/payment/cancellation", "/policies/copyright", "/report", "/support", "/policies/payment/payout", "/request", "/request/new","/subjects", "/courses", "/sitemaps/recent-notes.xml", "/sitemaps/most-viewed.xml","/sitemaps/subjects.xml","/sitemaps/courses.xml","/sitemaps/requests.xml"];
    var host = req.get("host");
    var data = {
        cate: cate,
        host: host
    }
    res.contentType("application/xml");
    res.render("sitemaps/sitemap", {
        data: data
    });
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
        res.status(404);
        res.contentType("text/html");
        return res.render("notfound");
    })
});

// most viewed sitemap route

router.get('/most-viewed.xml',  function (req, res, next) {
   
    productControllers.getMostViewedNotes().then((response) => {
        var host = req.get("host");
        var data = response.requested;
        res.contentType("application/xml");
        res.render("sitemaps/top-notes",{
            host: host,
            data: data
        });
    }).catch((error) => {
        res.status(404);
        res.contentType("text/html");
        return  res.render("notfound");
    });
    
});


router.get("/subjects.xml",(req,res,next)=>{

    var host = req.get("host");
    res.contentType("application/xml");
    res.render("sitemaps/subjects",{
        subjects: subjects,
        url: url,
        host: host
    });
});


router.get("/courses.xml",(req,res,next)=>{
    var host = req.get("host");
    res.contentType("application/xml");
    res.render("sitemaps/courses",{
        courses: courses,
        url: url,
        host: host
    });
});

router.get("/requests.xml",(req,res,next)=>{
    requestController.getAll().then((response)=>{
        var host = req.get("host");
        var data = response.requested;
        res.contentType("application/xml");
        res.render("sitemaps/requests",{
            host: host,
            data: data
        });
       
    }).catch((error)=>{
        res.status(404);
        res.contentType("text/html");
        return  res.render("notfound");
    })
})

module.exports = router;
