var express = require('express');
var router = express.Router();
router.get('/privacy', async function (req, res, next) {
    res.render("information-pages/privacy.pug");
});

router.get('/payment', async function (req, res, next) {
    res.render("policies/payment");
});

router.get("/copyright", async function (req, res, next) {
    res.render("policies/copyright");
});

router.get("/payment/refund", async function (req, res, next) {
    res.render("policies/refund");
});

router.get("/payment/cancellation", async function (req, res, next) {
    res.render("policies/cancellation");
});

router.get("/payment/payout", (req, res, next) => {
    res.render("policies/payout");
})

module.exports = router;