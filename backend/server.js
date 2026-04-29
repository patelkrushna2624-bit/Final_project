const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= MONGODB =================
mongoose
  .connect(
    "mongodb+srv://patelkrushna2624_db_user:krushna%402624@cluster0.foxi4cz.mongodb.net/jobportal?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= MODELS =================
const User = require("./models/User");
const Job = require("./models/Job");

// ================= APPLICATION MODEL =================
const applicationSchema = new mongoose.Schema(
  {
    jobId: String,
    jobTitle: String,
    company: String,

    applicantEmail: String,
    applicantName: String,

    resume: String,
    coverLetter: String,
    expectedSalary: String,

    postedBy: String,

    interviewDate: String,
    interviewTime: String,
    interviewMode: String,

    status: {
      type: String,
      default: "Applied",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

// ================= ROUTES =================

// TEST
app.get("/", (req, res) => {
  res.send("API running...");
});

// ================= AUTH =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ================= USERS =================
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
});

// ================= JOBS =================

// POST JOB
app.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();

    res.json({ success: true, job: newJob });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// GET ALL JOBS (for admin)
app.get("/jobs", async (req, res) => {
  const jobs = await Job.find().sort({ _id: -1 });
  res.json({ success: true, jobs });
});

// ✅ NEW: FILTER JOBS BASED ON USER EXPERIENCE
app.get("/jobs-by-user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.json({ success: true, jobs: [] });
    }

    const jobs = await Job.find({
      experienceLevel: { $lte: user.experience || 0 },
    }).sort({ _id: -1 });

    res.json({ success: true, jobs });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
});

// GET EMPLOYER JOBS
app.get("/employer-jobs/:email", async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.params.email,
    }).sort({ _id: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// DELETE JOB
app.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// ================= APPLY =================

app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const { jobId, applicantEmail, coverLetter, expectedSalary } = req.body;

    const existing = await Application.findOne({
      jobId,
      applicantEmail,
    });

    if (existing) {
      return res.json({
        success: false,
        message: "You already applied",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    const user = await User.findOne({ email: applicantEmail });

    const newApplication = new Application({
      jobId,
      jobTitle: job.title,
      company: job.company,

      applicantEmail,
      applicantName: user
        ? `${user.fname} ${user.lname}`
        : "Unknown",

      resume: req.file ? req.file.filename : "",
      coverLetter,
      expectedSalary,

      postedBy: job.postedBy,

      status: "Applied",
    });

    await newApplication.save();

    res.json({
      success: true,
      message: "Application submitted",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// ================= APPLICATIONS =================

// EMPLOYER APPLICATIONS
app.get("/applications/:email", async (req, res) => {
  try {
    const apps = await Application.find({
      postedBy: req.params.email,
    }).sort({ _id: -1 });

    res.json({
      success: true,
      applications: apps,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// JOB SEEKER APPLICATIONS
app.get("/my-applications/:email", async (req, res) => {
  const apps = await Application.find({
    applicantEmail: req.params.email,
  }).sort({ _id: -1 });

  res.json({
    success: true,
    applications: apps,
  });
});

// UPDATE STATUS
app.put("/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Application.findByIdAndUpdate(req.params.id, { status });

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// ================= INTERVIEW =================
app.put("/schedule-interview/:id", async (req, res) => {
  try {
    const { interviewDate, interviewTime, interviewMode } = req.body;

    await Application.findByIdAndUpdate(req.params.id, {
      status: "Interview",
      interviewDate,
      interviewTime,
      interviewMode,
    });

    res.json({
      success: true,
      message: "Interview scheduled",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});