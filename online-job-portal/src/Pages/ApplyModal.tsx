import { useState } from "react";

interface Props {
  job: any;
  onClose: () => void;
}

const ApplyModal = ({ job, onClose }: Props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    coverLetter: "",
    expectedSalary: "",
  });

  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();

    formData.append("jobId", job._id);
    formData.append("jobTitle", job.title);
    formData.append("company", job.company);

    formData.append("applicantEmail", user.email);
    formData.append(
      "applicantName",
      `${user.fname || ""} ${user.lname || ""}`
    );

    formData.append("coverLetter", form.coverLetter);
    formData.append("expectedSalary", form.expectedSalary);
    formData.append("resume", resume);

    try {
      const res = await fetch("http://localhost:5000/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Applied Successfully");
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      {/* MODAL BOX */}
      <div className="bg-white p-8 rounded-2xl w-500px space-y-5 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-900">
            Apply for {job.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✖
          </button>
        </div>

        {/* RESUME */}
        <div>
          <label className="block text-sm mb-2 text-blue-900">
            Upload Resume *
          </label>
          <input
            type="file"
            onChange={(e) =>
              setResume(e.target.files ? e.target.files[0] : null)
            }
            className="w-full p-2 bg-blue-50 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* COVER LETTER */}
        <div>
          <label className="block text-sm mb-2 text-blue-900">
            Cover Letter
          </label>
          <textarea
            placeholder="Write why you're a good fit..."
            onChange={(e) =>
              setForm({ ...form, coverLetter: e.target.value })
            }
            className="w-full p-3 rounded bg-blue-50 border border-blue-200 h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* EXPECTED SALARY */}
        <div>
          <label className="block text-sm mb-2 text-blue-900">
            Expected Salary
          </label>
          <input
            placeholder="e.g. 900000"
            onChange={(e) =>
              setForm({ ...form, expectedSalary: e.target.value })
            }
            className="w-full p-3 rounded bg-blue-50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Application
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplyModal;