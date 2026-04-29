import { useEffect, useState } from "react";

interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  resume: string;
  coverLetter: string;
  expectedSalary: string;
  status: string;
  createdAt: string;
}

const JobSeekerApplications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`http://localhost:5000/my-applications/${user.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data.applications || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#9bbbe0] p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2 text-blue-900">
        My Applications
      </h1>
      <p className="text-blue-800 mb-6">
        Track your job applications
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
                {app.jobTitle}
              </h2>

              {/* STATUS BADGE */}
              <span
                className={`text-sm px-3 py-1 rounded-full text-white ${
                  app.status === "Hired"
                    ? "bg-green-500"
                    : app.status === "Rejected"
                    ? "bg-red-500"
                    : app.status === "Shortlisted"
                    ? "bg-yellow-500 text-black"
                    : app.status === "Interview"
                    ? "bg-purple-500"
                    : "bg-blue-500"
                }`}
              >
                {app.status || "Pending"}
              </span>
            </div>

            {/* COMPANY */}
            <p className="text-gray-600 mb-2">
              {app.company}
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
              className="text-blue-600 underline text-sm"
            >
              📄 View Resume
            </a>

          </div>
        ))}

      </div>
    </div>
  );
};

export default JobSeekerApplications;