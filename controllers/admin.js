const Project = require("../models/project");
const User = require("../models/user");

module.exports.index = (req, res) => {
  res.render("admin/index");
};

module.exports.showPending = async (req, res) => {
  const pendingProjects = await Project.find({ status: "pending" }).populate(
    "author"
  );
  res.render("admin/projects/pending", { pendingProjects });
};

module.exports.approveProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "seeding" });
  await project.save();
  req.flash("success", "Successfully approved the project!");
  res.redirect("/admin/projects/pending");
};

module.exports.declineProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "declined" });
  await project.save();
  req.flash("success", "Successfully declined the project!");
  res.redirect("/admin/projects/pending");
};

module.exports.showSeeding = async (req, res) => {
  const seedingProjects = await Project.find({ status: "seeding" })
    .populate("author")
    .populate("donations");
  res.render("admin/projects/seeding", { seedingProjects });
};

module.exports.endProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, {
    status: "burgeoning",
  });
  await project.save();
  req.flash("success", "Successfully ended the project!");
  res.redirect("/admin/projects/seeding");
};

module.exports.showBurgeoning = async (req, res) => {
  const burgeoningProjects = await Project.find({
    status: "burgeoning",
  })
    .populate("author")
    .populate("donations");
  res.render("admin/projects/burgeoning", { burgeoningProjects });
};

module.exports.showDeclined = async (req, res) => {
  const declinedProjects = await Project.find({ status: "declined" }).populate(
    "author"
  );
  res.render("admin/projects/declined", { declinedProjects });
};

module.exports.moveToPending = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { status: "pending" });
  await project.save();
  req.flash("success", "Successfully moved the project to pending!");
  res.redirect("/admin/projects/declined");
};

module.exports.showUsers = async (req, res) => {
  const users = await User.find({});
  res.render("admin/users", { users });
};
