import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const JobseekerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [apps, setApps] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ FETCH APPLICATIONS
  useEffect(() => {
    fetch(`http://localhost:5000/my-applications/${user.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data.applications || []));
  }, []);

  // ✅ COUNTS
  const appliedCount = apps.length;
  const interviewCount = apps.filter(
    (a) => a.status === "Interview"
  ).length;

  // ✅ NEXT INTERVIEW
  const interviews = apps
    .filter((a) => a.status === "Interview" && a.interviewDate)
    .map((a) => ({
      ...a,
      dateObj: new Date(a.interviewDate),
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const nextInterview = interviews.length > 0 ? interviews[0] : null;

  // ✅ LAST 2 APPLICATIONS
  const recentApps = apps.slice(0, 3);

  return (
    <div className="flex min-h-screen bg-[#9bbbe0]">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-[#7ea6d9] p-5 flex flex-col justify-between text-white">

        <div>
          <h1 className="text-xl font-bold">TalentBridge</h1>
          <p className="text-sm mb-6 opacity-80">Job Seeker</p>

          <nav className="space-y-3">

            <div className="bg-blue-600 px-4 py-2 rounded-lg cursor-pointer">
              Dashboard
            </div>

            <div
              onClick={() => navigate("/jobseekerjoblist")}
              className="px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              Browse Jobs
            </div>

            <div
              onClick={() => navigate("/my-applications")}
              className="px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              My Applications
            </div>

            <div
              onClick={() => navigate("/notifications")}
              className="px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
            >
              Notifications
            </div>

          </nav>
        </div>

        {/* PROFILE */}
        <div className="bg-[#6c97cf] p-3 rounded-lg flex items-center gap-3">

          <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-bold">
            {user?.fname?.charAt(0)}
            {user?.lname?.charAt(0)}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">
              {user?.fname} {user?.lname}
            </p>
            <p className="text-xs opacity-80">{user?.email}</p>
          </div>

          <FaSignOutAlt
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-400"
          />
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">

          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="w-1/2 p-3 rounded-xl border border-blue-300 outline-none"
          />

          <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full text-white font-bold">
            {user?.fname?.charAt(0)}
            {user?.lname?.charAt(0)}
          </div>
        </div>

        {/* GREETING */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              Hello, {user?.fname} 👋
            </h2>
            <p className="text-blue-700">
              Here's your job search overview
            </p>
          </div>

          <button
            onClick={() => navigate("/jobseekerjoblist")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Browse Jobs
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* APPLIED */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-blue-600 text-sm">APPLIED</p>
            <h1 className="text-3xl font-bold text-blue-900">
              {appliedCount}
            </h1>
            <p className="text-green-600 text-sm">
              Total applications
            </p>
          </div>

          {/* INTERVIEWS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-blue-600 text-sm">INTERVIEWS</p>
            <h1 className="text-3xl font-bold text-blue-900">
              {interviewCount}
            </h1>

            <p className="text-blue-500 text-sm">
              {nextInterview
                ? `Next: ${new Date(
                    nextInterview.interviewDate
                  ).toLocaleDateString()} at ${nextInterview.interviewTime}`
                : "No interviews scheduled"}
            </p>
          </div>

        </div>

        {/* RECENT APPLICATIONS */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900">
              Recent Applications
            </h3>

            <span
              onClick={() => navigate("/my-applications")}
              className="text-blue-600 cursor-pointer"
            >
              View all →
            </span>
          </div>

          <div className="space-y-4">

            {recentApps.length === 0 ? (
              <p className="text-gray-500">
                No applications yet
              </p>
            ) : (
              recentApps.map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between items-center bg-blue-50 p-4 rounded-xl"
                >
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      {app.jobTitle}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {app.company}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      app.status === "Hired"
                        ? "bg-green-200 text-green-800"
                        : app.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : app.status === "Shortlisted"
                        ? "bg-yellow-200 text-yellow-800"
                        : app.status === "Interview"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default JobseekerDashboard;