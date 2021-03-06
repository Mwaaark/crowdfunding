const { projectSchema, commentSchema, donationSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Project = require("./models/project");
const Comment = require("./models/comment");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect("/projects");
  }
  next();
};

module.exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  await Project.findById(id);
  if (!req.user.isAdmin) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/projects/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (comment.author.equals(req.user._id) || req.user.isAdmin) {
    return next();
  }
  req.flash("error", "You do not have permission to do that!");
  return res.redirect(`/projects/${id}`);
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateDonation = (req, res, next) => {
  const { error } = donationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
