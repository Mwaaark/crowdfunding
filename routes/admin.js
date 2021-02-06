const express = require("express");
const Project = require("../models/project");
const User = require("../models/user");
const router = express.Router({ mergeParams: true });
// const donations = require("../controllers/donations");
const catchAsync = require("../utils/catchAsync");
// const { isLoggedIn, validateDonation } = require("../middleware");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/projects/pending", async (req, res) => {
  const pendingProjects = await Project.find({ status: "pending" }).populate(
    "author"
  );
  res.render("admin/projects/pending", { pendingProjects });
});

router.put("/projects/pending/approve/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "seeding" });
  await project.save();
  req.flash("success", "Successfully approved the project!");
  res.redirect("/admin/projects/pending");
});

router.put("/projects/pending/decline/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "declined" });
  await project.save();
  req.flash("success", "Successfully declined the project!");
  res.redirect("/admin/projects/pending");
});

router.get("/projects/seeding", async (req, res) => {
  const seedingProjects = await Project.find({ status: "seeding" })
    .populate("author")
    .populate("donations");
  res.render("admin/projects/seeding", { seedingProjects });
});

router.put("/projects/seeding/end/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "burgeoning" });
  await project.save();
  req.flash("success", "Successfully ended the project!");
  res.redirect("/admin/projects/seeding");
});

router.get("/projects/burgeoning", async (req, res) => {
  const burgeoningProjects = await Project.find({
    status: "burgeoning",
  })
    .populate("author")
    .populate("donations");
  res.render("admin/projects/burgeoning", { burgeoningProjects });
});

router.get("/projects/declined", async (req, res) => {
  const declinedProjects = await Project.find({ status: "declined" }).populate(
    "author"
  );
  res.render("admin/projects/declined", { declinedProjects });
});

router.put("/projects/declined/move-to-pending/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "pending" });
  await project.save();
  req.flash("success", "Successfully moved the project to pending!");
  res.redirect("/admin/projects/declined");
});

router.get("/users", async (req, res) => {
  const users = await User.find({});
  res.render("admin/users", { users });
});

module.exports = router;
