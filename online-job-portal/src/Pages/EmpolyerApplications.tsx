import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  resume: string;
  coverLetter: string;
  expectedSalary: string;
  status: string;
  createdAt: string;
}

const EmployerApplications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  const fetchApps = () => {
    fetch(`http://localhost:5000/applications/${user.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data.applications || []));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`http://localhost:5000/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (data.success) fetchApps();
  };

  return (
    <div className="min-h-screen bg-[#9bbbe0] p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2 text-blue-900">
        Applicants
      </h1>
      <p className="text-blue-800 mb-6">
        Review and manage all candidates
      </p>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-6">

        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-blue-700">
                {app.applicantName || "Unknown"}
              </h2>

              {/* STATUS */}
              <span
                className={`text-sm px-3 py-1 rounded-full text-white ${
                  app.status === "Hired"
                    ? "bg-green-500"
                    : app.status === "Rejected"
                    ? "bg-red-500"
                    : app.status === "Shortlisted"
                    ? "bg-yellow-400 text-black"
                    : app.status === "Interview"
                    ? "bg-purple-500"
                    : "bg-blue-500"
                }`}
              >
                {app.status}
              </span>
            </div>

            {/* JOB */}
            <p className="text-gray-600 mb-2">
              Applied for: {app.jobTitle || "Job Deleted"} at {app.company || ""}
            </p>

            {/* DATE */}
            <p className="text-sm text-gray-500 mb-2">
              Applied on: {new Date(app.createdAt).toLocaleDateString()}
            </p>

            {/* SALARY */}
            <p className="text-sm mb-2 text-gray-700">
              💰 Expected Salary: ₹{app.expectedSalary}
            </p>

            {/* COVER LETTER */}
            <p className="text-sm text-gray-600 mb-2">
              <b>Cover Letter:</b> {app.coverLetter || "N/A"}
            </p>

            {/* RESUME */}
            <a
              href={`http://localhost:5000/uploads/${app.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm block mb-3"
            >
              📄 View Resume
            </a>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3 flex-wrap">

              <button
                onClick={() => updateStatus(app._id, "Hired")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Hire
              </button>

              <button
                onClick={() => updateStatus(app._id, "Shortlisted")}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
              >
                Shortlist
              </button>

              <button
                onClick={() => updateStatus(app._id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>

              {/* INTERVIEW */}
              <button
                onClick={() => navigate(`/interview/${app._id}`)}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
              >
                Interview
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default EmployerApplications;