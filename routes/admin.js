const express = require("express");
const Project = require("../models/project");
const router = express.Router({ mergeParams: true });
// const donations = require("../controllers/donations");
const catchAsync = require("../utils/catchAsync");
// const { isLoggedIn, validateDonation } = require("../middleware");

router.get("/", async (req, res) => {
  const seedingProjects = await Project.find({ status: "pending" }).populate(
    "author"
  );
  res.render("admin/index", { seedingProjects });
});

module.exports = router;
