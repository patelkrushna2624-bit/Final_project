const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: String,
    jobTitle: String,     // ✅ ADD
    company: String,      // ✅ ADD
    applicantEmail: String,
    applicantName: String, // ✅ ADD
    resume: String,
    coverLetter: String,
    expectedSalary: String,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);