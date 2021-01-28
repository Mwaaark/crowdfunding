const Project = require("../models/project");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const projects = await Project.find({}).populate("author");
  res.render("projects/index", { projects });
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
  // console.log(project);
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
  // console.log(req.body);
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
    // console.log(project);
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
