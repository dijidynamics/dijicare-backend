const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  serviceName: { type: String, required: true },
  icon: { type: String, default: "" },
  requiresDoctor: { type: Boolean, default: false },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Service", ServiceSchema);

