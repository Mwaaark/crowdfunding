const Project = require("../models/project");
const Donation = require("../models/donation");

module.exports.renderDonate = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("donations/new", { project });
};
module.exports.donate = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const donation = new Donation(req.body.donation);
  donation.backer = req.user._id;
  project.donations.push(donation);
  await donation.save();
  await project.save();
  req.flash("success", "Successfully donated! Thanks for the donations!");
  res.redirect(`/projects/${project._id}`);
};
