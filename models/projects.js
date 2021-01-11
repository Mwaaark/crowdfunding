const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  location: String,
  targetAmount: Number,
  targetDate: String,
  description: String,
  image: String,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "declined", "seeding", "funded"],
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
