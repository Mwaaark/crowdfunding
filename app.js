const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
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

app.get("/projects", async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
});

app.get("/projects/new", (req, res) => {
  res.render("projects/new");
});

app.post("/projects", async (req, res, next) => {
  try {
    const project = new Project(req.body.project);
    await project.save();
    res.redirect(`/projects/${project._id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/projects/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/show", { project });
});

app.get("/projects/:id/edit", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/edit", { project });
});

app.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, { ...req.body.project });
  res.redirect(`/projects/${project._id}`);
});

app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.redirect("/projects");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use((err, req, res, next) => {
  res.send("error!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
