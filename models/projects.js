const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  targetAmount: Number,
  targetDate: String,
  location: String,
  description: String,
  status: String,
  image: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
