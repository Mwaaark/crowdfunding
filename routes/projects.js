const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateProject } = require("../middleware");

router
  .route("/")
  .get(catchAsync(projects.index))
  .post(isLoggedIn, validateProject, catchAsync(projects.createProject));

router.get("/new", isLoggedIn, projects.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(projects.showProject))
  .put(
    isLoggedIn,
    isAuthor,
    validateProject,
    catchAsync(projects.updateProject)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(projects.deleteProject));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(projects.renderEditForm)
);

module.exports = router;
