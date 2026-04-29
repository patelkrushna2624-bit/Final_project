const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    jobType: String,
    experienceLevel: Number,
    minSalary: String,
    maxSalary: String,
    deadline: String,
    openings: Number,
    description: String,
    requirements: String,
    benefits: String,
    postedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);