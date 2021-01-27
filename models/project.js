const mongoose = require("mongoose");
const Comment = require("./comment");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  location: String,
  targetAmount: Number,
  targetDate: Date,
  description: String,
  image: String,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "declined", "seeding", "funded"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  donations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});

ProjectSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    //deleteMany() instead of remove() because deprecated
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
