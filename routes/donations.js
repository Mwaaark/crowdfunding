const express = require("express");
const router = express.Router({ mergeParams: true });
const donations = require("../controllers/donations");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateDonation } = require("../middleware");

router.post("/", isLoggedIn, catchAsync(donations.createCheckoutSession));

module.exports = router;
