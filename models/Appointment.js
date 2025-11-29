import mongoose from "mongoose";

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
    type: String, // e.g., "General Checkup", "Blood Test"
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
    type: Date, // user selected date
    required: true,
  },

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

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
