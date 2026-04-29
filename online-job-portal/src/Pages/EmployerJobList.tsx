import { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  openings: number;
  description: string;
  requirements: string;
  benefits: string;
  postedBy: string;
}

const EmployerJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchJobs = () => {
    fetch(`http://localhost:5000/employer-jobs/${user.email}`)
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ DELETE JOB
  const deleteJob = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Job deleted");
      fetchJobs();
    }
  };

  return (
    <div className="min-h-screen bg-[#9bbbe0] p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        My Posted Jobs
      </h1>

      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >

            {/* TITLE */}
            <h2 className="text-xl font-bold text-blue-700">
              {job.title}
            </h2>

            {/* COMPANY */}
            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>

            {/* DETAILS */}
            <div className="mt-3 text-gray-700 space-y-1">
              <p>💼 {job.jobType}</p>
              <p>📊 Job Experience: {job.experienceLevel} Years</p>
              <p>💰 ₹{job.minSalary} - ₹{job.maxSalary}</p>
              <p>📅 Deadline: {job.deadline}</p>
              <p>👥 Openings: {job.openings}</p>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-3 text-gray-700">
              {job.description}
            </p>

            <p className="mt-2 text-gray-600">
              <b>Requirements:</b> {job.requirements}
            </p>

            <p className="text-gray-600">
              <b>Benefits:</b> {job.benefits}
            </p>

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteJob(job._id)}
              className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default EmployerJobList;