import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const [loginData, setLoginData] = useState({
  email: "",
  password: "",
});

   const navigate = useNavigate();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setLoginData({
    ...loginData,
    [e.target.id]: e.target.value,
  });
};

  const handleLogin = async () => {
     if (!loginData.email || !loginData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await res.json();

  if (data.success) {
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
    <div className="min-h-screen flex items-center justify-center bg-black ">
      <div className="bg-blue-200 p-8 rounded-2xl shadow-lg w-full max-w-md ">

        <h1  className="mb-6  text-2xl font-bold text-center ">Login</h1>

        

       <label htmlFor="email">Email Address</label>
        <input id="email" type="email" placeholder="Email"
        className="w-full mb-3 p-2 mt-1 border rounded-sm"
        onChange={handleChange}
        />

          <label htmlFor="password">Password</label>
          <input 
           id="password" type="password" placeholder="Password"
           className="w-full mb-3 mt-1 p-2 border rounded-sm" 
           onChange={handleChange}
            />

           <Link className="text-xs" to=''>Forgot Password?</Link>

        <button 
        className="w-full mt-2 p-2 border rounded bg-blue-800 cursor-pointer text-white" type="submit"
        onClick={handleLogin}
        >Login</button>

          <p className="text-sm text-center mt-4">
         Don't Have an account?
          <Link className="text-blue-800" to="/"> Signup</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;