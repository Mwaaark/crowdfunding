const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateDonation } = require("../middleware");
const Project = require("../models/project");
const Donation = require("../models/donation");

router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render("donations/new", { project });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateDonation,
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const donation = new Donation(req.body.donation);
    donation.backer = req.user._id;
    project.donations.push(donation);
    await donation.save();
    await project.save();
    res.redirect(`/projects/${project._id}`);
  })
);

module.exports = router;
