import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: "0", // ✅ default 0
    minSalary: "",
    maxSalary: "",
    deadline: "",
    openings: 0,
    description: "",
    requirements: "",
    benefits: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ prevent negative experience
    if (name === "experienceLevel" && Number(value) < 0) return;

    setJob({
      ...job,
      [name]: name === "openings" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...job,
          experienceLevel: job.experienceLevel || "0",
          minSalary: job.minSalary || "0",
          maxSalary: job.maxSalary || "0",
          requirements: job.requirements || "Not provided",
          benefits: job.benefits || "Not provided",
          postedBy: user.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Job Posted Successfully");

        setJob({
          title: "",
          company: "",
          location: "",
          jobType: "Full-time",
          experienceLevel: "0",
          minSalary: "",
          maxSalary: "",
          deadline: "",
          openings: 0,
          description: "",
          requirements: "",
          benefits: "",
        });

        navigate("/employerjoblist");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("❌ Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#9bbbe0] text-blue-900 p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
      <p className="text-blue-800 mb-6">
        Fill in all details to attract the right candidates
      </p>

      <div className="bg-[#c7d9f1] p-8 rounded-2xl space-y-6 max-w-full">

        {/* JOB TITLE */}
        <div>
          <label className="block text-sm mb-2">Job Title *</label>
          <input
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* COMPANY + LOCATION */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Company Name *</label>
            <input
              name="company"
              value={job.company}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Location *</label>
            <input
              name="location"
              value={job.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* JOB TYPE + EXPERIENCE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Job Type *</label>
            <select
              name="jobType"
              value={job.jobType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>

          {/* ✅ EXPERIENCE (NO NEGATIVE) */}
          <div>
            <label className="block text-sm mb-2">Experience (Years) *</label>
            <input
              type="number"
              name="experienceLevel"
              min="0"   // ✅ HARD BLOCK negative
              value={job.experienceLevel}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* SALARY */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Min Salary (₹)</label>
            <input
              name="minSalary"
              value={job.minSalary}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Max Salary (₹)</label>
            <input
              name="maxSalary"
              value={job.maxSalary}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DEADLINE + OPENINGS */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Application Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={job.deadline}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Openings</label>
            <input
              name="openings"
              value={job.openings}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm mb-2">Job Description *</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* REQUIREMENTS */}
        <div>
          <label className="block text-sm mb-2">Requirements</label>
          <textarea
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 h-28 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BENEFITS */}
        <div>
          <label className="block text-sm mb-2">Benefits</label>
          <textarea
            name="benefits"
            value={job.benefits}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#e6effa] border border-blue-300 h-28 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-6 py-3 rounded-lg text-white hover:bg-blue-700"
        >
          Post Job
        </button>

      </div>
    </div>
  );
};

export default PostJob;