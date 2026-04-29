import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const Notifications = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/my-applications/${user.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data.applications || []));
  }, []);

  // ✅ MESSAGE FORMAT (SENTENCE STYLE)
  const getMessage = (app: any) => {
    if (app.status === "Hired") {
      return `Your application for ${app.jobTitle} at ${app.company} has been selected. You are hired!`;
    }

    if (app.status === "Shortlisted") {
      return `Your application for ${app.jobTitle} at ${app.company} has been shortlisted.`;
    }

    if (app.status === "Rejected") {
      return `Your application for ${app.jobTitle} at ${app.company} was rejected.`;
    }

    if (app.status === "Interview") {
      return `Interview scheduled for ${app.jobTitle} at ${app.company} on ${app.interviewDate} at ${app.interviewTime} (${app.interviewMode}).`;
    }

    return `You applied for ${app.jobTitle} at ${app.company}.`;
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">

      {/* HEADER WITH BELL */}
      <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-6">
        <Bell /> Notifications
      </h1>

      <div className="space-y-4">

        {apps.length === 0 && (
          <p className="text-gray-600">No notifications yet</p>
        )}

        {apps.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded-lg shadow">

            {/* ✅ SENTENCE */}
            <p className="font-semibold text-blue-900">
              {getMessage(app)}
            </p>

            {/* DATE */}
            <p className="text-sm text-gray-500 mt-1">
              {new Date(app.updatedAt || app.createdAt).toLocaleString()}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Notifications;