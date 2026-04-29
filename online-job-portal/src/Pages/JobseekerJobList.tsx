import { useEffect, useState } from "react";
import ApplyModal from "./ApplyModal";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: number; // ✅ FIXED (was string)
  minSalary: string;
  maxSalary: string;
  deadline: string;
  openings: number;
  description: string;
  requirements: string;
  benefits: string;
  postedBy: string;
}

const JobseekerJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ✅ FIXED API ONLY (NO UI CHANGE)
    fetch(`http://localhost:5000/jobs-by-user/${user.email}`)
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#9bbbe0] p-6">

      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Available Jobs
      </h1>

      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold text-blue-700">
              {job.title}
            </h2>

            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>

            <div className="mt-3 text-gray-700 space-y-1">
              <p>💼 {job.jobType}</p>
              <p>📊 JobExperience: {job.experienceLevel} Years</p>
              <p>💰 ₹{job.minSalary} - ₹{job.maxSalary}</p>
              <p>📅 Deadline: {job.deadline}</p>
              <p>👥 Openings: {job.openings}</p>
            </div>

            <p className="mt-3 text-gray-700">
              <b>Description:</b> {job.description}
            </p>

            <p className="mt-2 text-gray-600">
              <b>Requirements:</b> {job.requirements}
            </p>

            <p className="text-gray-600">
              <b>Benefits:</b> {job.benefits}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Posted by: {job.postedBy}
            </p>

            <button
              onClick={() => setSelectedJob(job)}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply
            </button>

          </div>
        ))}

      </div>

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobseekerJobList;