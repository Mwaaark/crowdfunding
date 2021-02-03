const Project = require("../models/project");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const projects = await Project.find({ status: "pending" })
    .populate("author")
    .populate("donations");
  const fundedProjects = await Project.find({ status: "funded" })
    .populate("author")
    .populate("donations");
  res.render("projects/index", { projects, fundedProjects });
};

module.exports.renderNewForm = (req, res) => {
  res.render("projects/new");
};

module.exports.createProject = async (req, res, next) => {
  const project = new Project(req.body.project);
  project.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  project.author = req.user._id;
  await project.save();
  req.flash(
    "success",
    "You have successfully submitted a new project! We will inform you once the project is approved!"
  );
  res.redirect("/projects");
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate({
      path: "comments",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "donations",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: {
        path: "backer",
      },
    })
    .populate("author");
  if (!project) {
    req.flash("error", "Project not found!");
    return res.redirect("/projects");
  }
  let amountRaised = 0;
  res.render("projects/show", { project, amountRaised });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    req.flash("error", "Project not found!");
    return res.redirect("/projects");
  }
  res.render("projects/edit", { project });
};

module.exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, {
    ...req.body.project,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  project.images.push(...imgs);
  await project.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await project.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated the project!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a project!");
  res.redirect("/projects");
};
