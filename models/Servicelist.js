const mongoose = require("mongoose");

const ServicelistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  requiresDoctor: { type: Boolean, default: false },
  createdById: { type: String, required: true },  // admin Firebase UID
   createdBy: { type: String, required: true },   // admin email
   isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Servicelist", ServicelistSchema);