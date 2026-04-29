import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Interview = () => {
  const { id } = useParams(); // application ID
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Online");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/schedule-interview/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewDate: date,
          interviewTime: time,
          interviewMode: mode,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Interview Scheduled ✅");
      navigate("/applications");
    } else {
      alert("Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#9bbbe0] flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Schedule Interview
        </h2>

        {/* DATE */}
        <label className="block mb-2 text-sm text-blue-900">
          Select Date
        </label>
        <input
          type="date"
          className="w-full p-2 mb-4 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* TIME */}
        <label className="block mb-2 text-sm text-blue-900">
          Select Time
        </label>
        <input
          type="time"
          className="w-full p-2 mb-4 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        {/* MODE */}
        <label className="block mb-2 text-sm text-blue-900">
          Mode
        </label>
        <select
          className="w-full p-2 mb-6 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option>Online</option>
          <option>Offline</option>
        </select>

        {/* SUBMIT */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Schedule
        </button>
      </form>

    </div>
  );
};

export default Interview;