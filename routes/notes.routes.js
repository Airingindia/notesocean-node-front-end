require("dotenv").config();
var express = require('express');
var router = express.Router();
const timeService = require('../services/time.services');
const productControllers = require("../controllers/product.controller");
const api_url = process.env.API_URL;
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require("pdf-lib");
router.get("/", (req, res, next) => {
    res.redirect("/");
});
// router.get('/', async (req, res) => {
//     const pdfpath = path.join(__dirname, 'new.pdf');
//     fs.readFile(pdfpath, async function (err, data) {
//         var pdf = await PDFDocument.load(data);
//         let pages = pdf.getPageCount();
//         for (let i = 1; i < pages; i++) {
//             pdf.removePage(1);
//         }
//         pdf.setAuthor("sachin kumar");
//         pdf.setKeywords(["class 10", "class 20", "class 30", "class 40", "class 50", "class 60"]);
//         pdf.setLanguage("en");
//         pdf.setProducer("Notes Ocean");
//         pdf.setTitle("this is a test page");
//         pdf.setSubject("class 10");
//         const page = pdf.addPage();
//         page.drawText('For more pages you need pay \n click this link below to pay \n\n  https://notesocean.com', {
//             x: 100,
//             y: 800,
//         });

//         const pdfBytes = await pdf.save();
//         res.contentType("application/pdf");
//         res.setHeader('Content-disposition', 'inline; filename="WhateverFilenameYouWant.pdf"');
//         res.setHeader("Content-Transfer-Encoding", "binary");
//         res.setHeader("Accept-Ranges", "bytes");
//         fs.writeFileSync("temp/new.pdf", pdfBytes);
//         fs.readFile("temp/new.pdf", function (err, data) {
//             res.send(data);
//             fs.unlinkSync("temp/new.pdf");
//         });
//         // res.send(pdfBytes);
//     });

// });

// router.get('/notes', async function (req, res, next) {
//     var stream = await fs.ReadStream(path.join(__dirname, 'test.pdf'));
//     var filename = "WhateverFilenameYouWant.pdf";
//     // // Be careful of special characters
//     // filename = encodeURIComponent(filename);
//     // // Ideally this should strip them
//     res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
//     res.setHeader('Content-type', 'application/pdf');
//     stream.pipe(res);
// });

// router.get('/notes2.pdf', async function (req, res, next) {
//     res.contentType("application/pdf");
//     res.setHeader('Content-disposition', 'inline; filename="WhateverFilenameYouWant.pdf"');
//     res.setHeader("Content-Transfer-Encoding", "binary");
//     res.setHeader("Accept-Ranges", "bytes");
//     // res.download(pdfpath);
//     fs.readFile(pdfpath, function (err, data) {
//         res.send(data);
//     });
// });
router.get("/live-reading", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    res.render("notes/live-reading");
});
router.get("/most-viewed", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    productControllers.getMostViewedNotes().then((notes) => {
        res.render("notes/most-viewed", {
            data: notes, timeService: timeService
        });
    }).catch((err) => {
        console.log(err);
        res.status(404).render("notfound");
    });
});

router.get("/:id", (req, res, next) => {
    res.cookie("api", btoa(api_url));
    if (!isNaN(req.params.id)) {
        var token = "";
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        productControllers.getInfo(req.params.id, token).then((product) => {
            res.render("notes/view-notes", {
                data: product, timeService: timeService, api: api_url
            });
            next();
            if (req.cookies.ampuser) {
                var deviceId = req.cookies.ampuser;
                productControllers.addViews(product.product.id, token, deviceId).then((response) => {
                    console.log(response);
                    next();
                }).catch((error) => {

                });
            }

        }).catch((error) => {
            console.log(error);
            if (error.statusCode == 429) {
                res.render("information-pages/tomanyrequest");
            }
            else if (error.statusCode == 401) {
                res.redirect("/session-expire");
            } else {
                res.render("notfound");
            }
            next();
        });
    } else {
        console.log(err);
        res.status(404);
        res.render("notfound");
    }

});
router.get("/request/all", (req, res, next) => {
    backURL = req.header('Referer') || '/';
    // do your thang
    console.log(backURL);
});
module.exports = router;