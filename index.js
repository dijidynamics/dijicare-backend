require("dotenv").config();   // <-- VERY IMPORTANT
//npm install dotenv - need to install
const express = require('express');
/* express – Loads the Express framework (used to build APIs) */
const mongoose = require('mongoose');
/* mongoose – Connects your app to a MongoDB database */
const cors = require('cors');
/* cors – Enables Cross-Origin Resource Sharing (frontend & backend) */
const app = express();
/* Initializes an instance of an Express application */
app.use(cors());
/* app.use(cors()) – Allows requests from your frontend 
(even from different ports) */
app.use(express.json());
/* app.use(express.json()) – Parses JSON data in incoming requests 
(e.g., form data) */
//upload files image
const multer = require("multer");
//models
const Clinic = require("./models/Clinic")
const Doctor = require("./models/Doctor")
const Service = require("./models/Services")
const Servicelist = require("./models/Servicelist")

//create clinic code  

app.post("/api/clinic/create", async (req, res) => {
  try {
    const { 
      clinicname, 
      clinicaddress, 
      cliniccountry, 
      cliniclogo, 
      createdBy,
      clinicopenTime,
      cliniccloseTime,
      workingDays,
       status    // <-- Add this line
    } = req.body;

    if (!clinicname || !clinicaddress || !cliniccountry || !createdBy) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newClinic = new Clinic({
      clinicname,
      clinicaddress,
      cliniccountry,
      cliniclogo: cliniclogo || "",
      createdBy,
      clinicopenTime,
      cliniccloseTime,
      workingDays,
      status: status || "active", // <-- default to active
    });

    await newClinic.save();

    res.status(201).json({
      message: "Clinic created successfully",
      clinic: newClinic
    });

  } catch (error) {
    console.error("Create Clinic Error:", error);
    res.status(500).json({ message: "Server error while creating clinic" });
  }
});


//fetch clinic all details
app.get("/api/clinic/all", async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ createdAt: -1 });
    res.status(200).json(clinics);
  } catch (error) {
    console.error("Fetch Clinics Error:", error);
    res.status(500).json({ message: "Server error while fetching clinics" });
  }
});

//update clinic
// UPDATE clinic
app.put("/api/clinic/update/:id", async (req, res) => {
  try {
    const clinicId = req.params.id;

    const {
      clinicname,
      clinicaddress,
      cliniccountry,
      cliniclogo,
     clinicopenTime,
      cliniccloseTime,
      workingDays, 
      status   // <-- fix this
    } = req.body;

    const updatedClinic = await Clinic.findByIdAndUpdate(
      clinicId,
      {
        clinicname,
        clinicaddress,
        cliniccountry,
        cliniclogo,
         clinicopenTime,
        cliniccloseTime,
      workingDays, 
      status   // <-- use this
      },
      { new: true }
    );

    if (!updatedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json({
      message: "Clinic updated successfully",
      clinic: updatedClinic
    });

  } catch (error) {
    console.error("Update Clinic Error:", error);
    res.status(500).json({ message: "Server error while updating clinic" });
  }
});

//upload image into backend folder 

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const doctorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  // same folder as clinic logos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique filenames
  }
});

const doctorUpload = multer({ storage: doctorStorage });

// Make uploads folder public
app.use("/uploads", express.static("uploads"));

// Upload API
app.post("/api/clinic/upload-logo", upload.single("cliniclogo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Logo uploaded successfully",
    imageUrl: `/uploads/${req.file.filename}`
  });
});


//upload doctor image
app.post("/api/doctor/upload-photo", doctorUpload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No photo uploaded" });
  }

  res.json({
    message: "Doctor photo uploaded successfully",
    imageUrl: `/uploads/${req.file.filename}`
  });
});

app.get("/api/doctor/all", async (req, res) => {
  try {
    // populate clinic name
    const doctors = await Doctor.find()
      .populate("clinicId", "clinicname")  // get clinicname from clinic
      .sort({ createdAt: -1 });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    res.status(500).json({ message: "Server error while fetching doctors" });
  }
});

app.get("/api/doctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("clinicId", "clinicname");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Fetch Doctor Error:", error);
    res.status(500).json({ message: "Server error while fetching doctor" });
  }
});
app.put("/api/doctor/update/:id", async (req, res) => {
  try {
   const updatedDoctor = await Doctor.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);
    res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({ message: "Server error while updating doctor" });
  }
});

//add doctor 
// Create Doctor API
app.post("/api/doctor/create", async (req, res) => {
  try {
    const {
      doctorName,
      doctorDegree,
      specialty,
      photo,
      clinicId,
      workingFrom,
      workingTo,
      slotDuration,
      createdBy,
      createdById,
       status    // <-- Add this line
    } = req.body;

    if (!doctorName || !doctorDegree || !specialty || !clinicId || !workingFrom || !workingTo || !slotDuration || !createdBy || !createdById) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // 1️⃣ Fetch clinic
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    // 2️⃣ Create doctor with clinicName
    const newDoctor = new Doctor({
      doctorName,
      doctorDegree,
      specialty,
      photo: photo || "",
      clinicId,
      clinicName: clinic.clinicname,  // <-- add this
      workingFrom,
      workingTo,
      slotDuration,
      createdBy,
      createdById,
          status   // <-- use this
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoctor
    });

  } catch (error) {
    console.error("Create Doctor Error:", error);
    res.status(500).json({ message: "Server error while creating doctor" });
  }
});

app.get("/api/services/clinic/:clinicId", async (req, res) => {
  try {
    const services = await Service.find({
      clinicId: req.params.clinicId,
    });

    res.json(services);
  } catch (err) {
    console.error("Fetch services error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.delete("/api/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// CREATE SERVICES
app.post("/api/services/create", async (req, res) => {
  try {
    console.log("Incoming data:", req.body);   // ← ADD THIS

    const { clinicId, doctorId, services, createdBy } = req.body;

    if (!clinicId || !services || services.length === 0) {
      console.log("Missing fields");
      return res.status(400).json({ message: "Required fields missing" });
    }

    const serviceDocs = services.map((serviceName) => ({
      clinicId,
      doctorId: doctorId || null,
      serviceName,
      icon: "",
      requiresDoctor: false,
      createdBy,
    }));

    console.log("Insert docs:", serviceDocs);  // ← ADD THIS

    const result = await Service.insertMany(serviceDocs);

    res.status(201).json({
      message: "Services created successfully",
      data: result,
    });

  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/services/all", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("clinicId", "clinicname")
      .populate("doctorId", "doctorName photo");

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error loading services" });
  }
});
app.delete("/api/services/delete/:id", async (req, res) => {
  try {
    await Services.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
// UPDATE SERVICE
app.put("/api/services/update/:id", async (req, res) => {
  try {
    const { clinicId, doctorId, services } = req.body;

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { clinicId, doctorId, services },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});
//add services 
app.post("/api/servicelist", async (req, res) => {
  try {
    const service = new Servicelist({
      name: req.body.name,
      icon: req.body.icon,
      requiresDoctor: req.body.requiresDoctor,
      createdById: req.body.createdById,
      createdBy: req.body.createdBy
    });

    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// UPDATE SERVICELIST
app.put("/api/servicelist/:id", async (req, res) => {
  try {
    const updated = await Servicelist.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        requiresDoctor: req.body.requiresDoctor,
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});


// GET ALL SERVICES
app.get("/api/servicelist", async (req, res) => {
  try {
    const services = await Servicelist.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/servicelist/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await Servicelist.find({ createdById: userId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE SERVICE
app.delete("/api/servicelist/:id", async (req, res) => {
  try {
    const deleted = await Servicelist.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Service not found" });

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// FINAL UPDATE SERVICES (PERFECT)
app.put("/api/services/update", async (req, res) => {
  try {
    const { clinicId, doctorId, services } = req.body;

    if (!clinicId) return res.status(400).json({ error: "clinicId missing" });

    // 1️⃣ Delete OLD services
    await Service.deleteMany({ clinicId, doctorId: doctorId || null });

    // 2️⃣ Insert NEW services
    const docs = services.map((name) => ({
      clinicId,
      doctorId: doctorId || null,
      serviceName: name,
      icon: "",
      requiresDoctor: false,
    }));

    const newServices = await Service.insertMany(docs);

    res.json({ success: true, data: newServices });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});


app.listen(3001, () => {
  console.log("Server is Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });