const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  amount: Number,
  createdAt: { type: Date, default: Date.now },
  backer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Donation", donationSchema);
