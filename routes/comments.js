const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { commentSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const Project = require("../models/project");
const Comment = require("../models/comment");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateComment,
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    project.comments.push(comment);
    await comment.save();
    await project.save();
    req.flash("success", "Successfully created a new comment!");
    res.redirect(`/projects/${project._id}`);
  })
);

router.delete(
  "/:commentId",
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Project.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/projects/${id}`);
  })
);

module.exports = router;
