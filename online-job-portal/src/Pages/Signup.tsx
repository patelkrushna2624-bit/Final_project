import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [role, setRole] = useState("jobseeker");

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    experience: 0, // ✅ ADDED
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: id === "experience" ? Math.max(0, Number(value)) : value, // ✅ prevent negative
    });
  };

  const handleSignup = async () => {
    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role,
          experience: role === "jobseeker" ? formData.experience : 0, // ✅ only for jobseeker
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful");

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate(`/${data.user.role}dashboard`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-blue-200 p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="mb-6 text-2xl font-bold text-center">
          Create Your Account
        </h1>

        {/* ROLE */}
        <div className="flex gap-2 mb-6 p-1">
          <button
            className={`flex-1 py-2 rounded ${
              role === "jobseeker" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
            onClick={() => setRole("jobseeker")}
          >
            Job Seeker
          </button>

          <button
            className={`flex-1 py-2 rounded ${
              role === "employer" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
            onClick={() => setRole("employer")}
          >
            Employer
          </button>

          <button
            className={`flex-1 py-2 rounded ${
              role === "admin" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        {/* INPUTS */}
        <div className="flex gap-4 mb-3">
  
          {/* First Name */}
          <div className="w-1/2">
            <label htmlFor="fname" className="block mb-1">First Name</label>
            <input
              id="fname"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Last Name */}
          <div className="w-1/2">
            <label htmlFor="lname" className="block mb-1">Last Name</label>
            <input
              id="lname"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>

        {/* EMAIL */}
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* PASSWORD */}
        <div className="flex gap-4 mb-3">

          <div className="w-1/2">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>

        {/* ✅ EXPERIENCE (ONLY JOBSEEKER) */}
        {role === "jobseeker" && (
          <div className="mb-3">
            <label htmlFor="experience" className="block mb-1">
              Experience (Years)
            </label>
            <input
              id="experience"
              type="number"
              min="0"
              placeholder="Enter experience"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <button
          className="w-full bg-blue-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSignup}
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?
          <Link className="text-blue-950" to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;