const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { projectSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Project = require("./models/projects");

mongoose.connect("mongodb://localhost:27017/crowdfunding", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get(
  "/projects",
  catchAsync(async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", { projects });
  })
);

app.get("/projects/new", (req, res) => {
  res.render("projects/new");
});

app.post(
  "/projects",
  validateProject,
  catchAsync(async (req, res, next) => {
    // if (!req.body.project) throw new ExpressError("Invalid Project Data", 400);
    const project = new Project(req.body.project);
    await project.save();
    res.redirect(`/projects/${project._id}`);
  })
);

app.get(
  "/projects/:id",
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render("projects/show", { project });
  })
);

app.get(
  "/projects/:id/edit",
  catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render("projects/edit", { project });
  })
);

app.put(
  "/projects/:id",
  validateProject,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, {
      ...req.body.project,
    });
    res.redirect(`/projects/${project._id}`);
  })
);

app.delete(
  "/projects/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect("/projects");
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
