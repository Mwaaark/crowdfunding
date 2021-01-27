const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {
  validateComment,
  isLoggedIn,
  isCommentAuthor,
} = require("../middleware");
const Project = require("../models/project");
const Comment = require("../models/comment");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    project.comments.push(comment);
    await comment.save();
    await project.save();
    req.flash("success", "Successfully created a new comment!");
    res.redirect(`/projects/${project._id}`);
  })
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Project.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted a comment!");
    res.redirect(`/projects/${id}`);
  })
);

module.exports = router;
