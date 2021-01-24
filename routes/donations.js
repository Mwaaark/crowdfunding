const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { donationSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const Project = require("../models/project");
const Donation = require("../models/donation");

const validateDonation = (req, res, next) => {
  const { error } = donationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/new",
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render("donations/new", { project });
  })
);

router.post(
  "/",
  validateDonation,
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const donation = new Donation(req.body.donation);
    project.donations.push(donation);
    await donation.save();
    await project.save();
    res.redirect(`/projects/${project._id}`);
  })
);

module.exports = router;
