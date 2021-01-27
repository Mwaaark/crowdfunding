const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateProject } = require("../middleware");
const Project = require("../models/project");

router.get("/new", isLoggedIn, (req, res) => {
  res.render("projects/new");
});

router.get(
  "/",
  catchAsync(async (req, res) => {
    const projects = await Project.find({}).populate("author");
    res.render("projects/index", { projects });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateProject,
  catchAsync(async (req, res, next) => {
    const project = new Project(req.body.project);
    project.author = req.user._id;
    await project.save();
    req.flash(
      "success",
      "Successfully submitted a new project! We will inform you once the project is approved!"
    );
    res.redirect("/projects");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .populate({
        path: "donations",
        populate: {
          path: "backer",
        },
      })
      .populate("author");
    if (!project) {
      req.flash("error", "Project not found!");
      return res.redirect("/projects");
    }
    res.render("projects/show", { project });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      req.flash("error", "Project not found!");
      return res.redirect("/projects");
    }
    res.render("projects/edit", { project });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateProject,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, {
      ...req.body.project,
    });
    req.flash("success", "Successfully updated the project!");
    res.redirect(`/projects/${project._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a project!");
    res.redirect("/projects");
  })
);

module.exports = router;
