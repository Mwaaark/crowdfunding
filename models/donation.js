const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
