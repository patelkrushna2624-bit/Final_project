import { useEffect, useState } from "react";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetch(`http://localhost:5000/employer-jobs/${user.email}`)
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));

    fetch(`http://localhost:5000/applications/${user.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data.applications || []));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#9bbbe0]">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#7ea6d9] p-5 flex flex-col justify-between text-white">
        <div>
          <h1 className="text-xl font-bold">TalentBridge</h1>
          <p className="text-sm mb-6 opacity-80">Employer</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-blue-600 p-3 rounded-lg cursor-pointer">
              Dashboard
            </div>

            <div
              onClick={() => navigate("/postjob")}
              className="p-3 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              Post a Job
            </div>

            <div
              onClick={() => navigate("/employerjoblist")}
              className="p-3 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              View Jobs
            </div>

            <div
              onClick={() => navigate("/applications")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              <FaUsers />
              Applicants
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 mt-10">

          <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
            {user?.fname?.charAt(0) || "U"}
            {user?.lname?.charAt(0) || ""}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {user?.fname || "User"} {user?.lname || ""}
            </p>
            <p className="text-xs text-blue-800">
              {user?.email || "email@example.com"}
            </p>
          </div>

          <FaSignOutAlt onClick={handleLogout} className="cursor-pointer hover:text-red-600" />
          
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Employer Dashboard
            </h1>
            <p className="text-gray-700">
              Manage your job postings & candidates
            </p>
          </div>

          <button
            onClick={() => navigate("/postjob")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + Post a Job
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl ">
            <p className="text-sm  opacity-80">ACTIVE JOBS</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">{jobs.length}</h2>
            <p className="text-sm mt-1 text-blue-600 opacity-80">Total jobs posted</p>
          </div>

          <div className="bg-white p-6 rounded-2xl ">
            <p className="text-sm  opacity-80">TOTAL APPLICANTS</p>
            <h2 className="text-4xl text-blue-900 font-bold mt-2">{apps.length}</h2>
            <p className="text-sm mt-1 opacity-80 text-blue-600">Across all jobs</p>
          </div>

          <div className="bg-white p-6 rounded-2xl  ">
            <p className="text-sm opacity-80">SHORTLISTED</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {apps.filter(a => a.status === "Shortlisted").length}
            </h2>
            <p className="text-sm mt-1 opacity-80 text-blue-600">Pending review</p>
          </div>

          <div className="bg-white p-6 rounded-2xl ">
            <p className="text-sm opacity-80 ">HIRED</p>
            <h2 className="text-4xl font-bold mt-2 text-blue-900">
              {apps.filter(a => a.status === "Hired").length}
            </h2>
            <p className="text-sm mt-1 opacity-80 text-blue-600">Successful hires</p>
          </div>

        </div>

        {/* ================= INTERVIEWS SECTION ================= */}
        <div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Scheduled Interviews
          </h2>

          {apps.filter(a => a.status === "Interview").length === 0 ? (
            <p className="text-gray-600">No interviews scheduled</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {apps
                .filter((a) => a.status === "Interview")
                .map((app) => (
                  <div
                    key={app._id}
                    className="bg-[#6c97cf] p-6 rounded-2xl text-white shadow-lg"
                  >

                    <div className="flex justify-between mb-3">
                      <h3 className="text-lg font-bold">
                        {app.applicantName}
                      </h3>
                      <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                        Interview
                      </span>
                    </div>

                    <p className="text-sm opacity-90 mb-4">
                      {app.jobTitle} at {app.company}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">

                      <div>
                        <p className="opacity-80">Date</p>
                        <p className="font-semibold">{app.interviewDate}</p>
                      </div>

                      <div>
                        <p className="opacity-80">Time</p>
                        <p className="font-semibold">{app.interviewTime}</p>
                      </div>

                      <div>
                        <p className="opacity-80">Mode</p>
                        <p className="font-semibold">{app.interviewMode}</p>
                      </div>

                      <div>
                        <p className="opacity-80">Email</p>
                        <p className="font-semibold break-all">
                          {app.applicantEmail}
                        </p>
                      </div>


                    </div>

                  </div>
                ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;