const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { projectSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const Project = require("../models/project");

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/new", isLoggedIn, (req, res) => {
  res.render("projects/new");
});

router.get(
  "/",
  catchAsync(async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", { projects });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateProject,
  catchAsync(async (req, res, next) => {
    const project = new Project(req.body.project);
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
      .populate("comments")
      .populate("donations");
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
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a project!");
    res.redirect("/projects");
  })
);

module.exports = router;
