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

const AdminJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = () => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id: string) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Job deleted");
      fetchJobs();
    }
  };

  return (
    <div className="min-h-screen bg-[#9bbbe0] p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        All Jobs
      </h1>
      <p className="text-blue-800 mb-6">
        Manage all job postings across platform
      </p>

      {/* JOB LIST */}
      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-2xl shadow"
          >

            {/* TITLE */}
            <h2 className="text-xl font-bold text-blue-900">
              {job.title}
            </h2>

            {/* COMPANY */}
            <p className="text-gray-600 mb-2">
              {job.company} • {job.location}
            </p>

            {/* DETAILS */}
            <p className="text-sm text-gray-700">💼 {job.jobType}</p>
            <p className="text-sm text-gray-700">📊 jobExperience: {job.experienceLevel} Years</p>
            <p className="text-sm text-gray-700">
              💰 ₹{job.minSalary} - ₹{job.maxSalary}
            </p>
            <p className="text-sm text-gray-700">
              📅 Deadline: {job.deadline}
            </p>
            <p className="text-sm text-gray-700">
              👥 Openings: {job.openings}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-3 text-gray-800">
              <b>Description:</b> {job.description}
            </p>
            <p className=" mt-3 text-gray-800">
              <b>Requirements:</b> {job.requirements}
            </p>

            <p className="mt-3 text-gray-800">
              <b>Benefits:</b> {job.benefits}
            </p>

            {/* POSTED BY */}
            <p className="text-sm text-gray-600 mt-2">
              <b>Posted By:</b> {job.postedBy}
            </p>

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteJob(job._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminJobList;