const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  doctorDegree: { type: String, required: true },
  specialty: { type: String, required: true },
  photo: { type: String }, // store uploaded photo URL
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
   clinicName: { type: String },   // <-- Add this field
  workingFrom: { type: String, required: true },
  workingTo: { type: String, required: true },
  slotDuration: { type: Number, required: true }, // in minutes
  createdBy: { type: String, required: true },    // admin email
  createdById: { type: String, required: true },  // admin Firebase UID
   status: { type: String, default: "active" }  // <-- add this
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
