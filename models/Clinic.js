const mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
  clinicname: { type: String, required: true },
  clinicaddress: { type: String, required: true },
  cliniccountry: { type: String, required: true },
  cliniclogo: { type: String },  
  status: { type: String, default: "active" },
  createdBy: { type: String, required: true },

  clinicopenTime: String,
  cliniccloseTime: String,
  workingDays: [String],
 status: { type: String, default: "active" }  // <-- add this

}, { timestamps: true });

module.exports = mongoose.model("Clinic", ClinicSchema);

