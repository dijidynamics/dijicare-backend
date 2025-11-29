const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientContact: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
  },

  reason: {
    type: String,
    required: true,
  },

  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  status: {
    type: String,
    enum: ["Booked", "Visited", "Cancelled", "Rescheduled"],
    default: "Booked",
  },

  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: { type: String, required: true }, // new time field
  visitedDate: {
    type: Date,
  },

  rescheduledDate: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
