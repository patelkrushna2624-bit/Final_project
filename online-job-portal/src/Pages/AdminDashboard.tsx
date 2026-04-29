import { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type UserType = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  createdAt?: string;
};

const AdminDashboard = () => {

  const navigate = useNavigate()

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState<UserType[]>([]);

  // FETCH USERS
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="h-screen flex bg-blue-200 text-gray-800 overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-300 flex flex-col justify-between">

        <div>
          <div className="p-5">
            <h1 className="text-xl font-bold text-blue-900">
              TalentBridge
            </h1>
            <p className="text-sm">Administrator</p>
          </div>

          <div className="px-3 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-700 text-white">
              <FaHome /> Admin Dashboard
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-400 cursor-pointer">
              <FaUsers /> Manage Users
            </div>

            {/* View Jobs */}

             <div
              onClick={() => navigate("/adminjoblist")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 cursor-pointer"
            >              
            <FaBriefcase /> All Jobs
            </div>
          
          </div>
        </div>

        {/* USER */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center">
              {loggedUser.fname.charAt(0)}{loggedUser.lname.charAt(0)}
            </div>
            <div>
              <p className="text-sm">
                {loggedUser?.fname} {loggedUser?.lname}
              </p>
              <p className="text-xs">{loggedUser?.email}</p>
            </div>
          </div>

          <FaSignOutAlt onClick={handleLogout} className="cursor-pointer hover:text-red-600" />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between p-5 bg-blue-300">
          <input
            placeholder="Search..."
            className="px-4 py-2 rounded-lg w-1/3"
          />

          <div className="flex items-center gap-4">
            
            <div className="w-10 h-10 bg-blue-700 text-white flex items-center justify-center rounded-full">
              {loggedUser.fname.charAt(0)}{loggedUser.lname.charAt(0)}
            </div>
          </div>
        </div>

      
  
         <div className="grid grid-cols-2 gap-6 m-2">

  <div className="bg-white  p-6 rounded-xl">
    <p className="text-sm text-blue-600 opacity-80">TOTAL USERS</p>

    <h2 className="text-4xl font-bold text-blue-900 mt-2">
      {users.length}
    </h2>

    <p className="text-sm mt-1 opacity-80">
      Active users
    </p>
  </div>

  <div className="bg-white  p-5 rounded-xl">
    <p className="text-sm text-blue-600 opacity-80">EMPLOYERS</p>

    <h2 className="text-4xl text-blue-900 font-bold mt-2">
      {users.filter(u => u.role === "employer").length}
    </h2>

    <p className="text-sm mt-1 opacity-80">
      Hiring companies
    </p>
  </div>

  <div className="bg-white  p-6 rounded-xl">
    <p className="text-sm text-blue-600 opacity-80">JOB SEEKERS</p>

    <h2 className="text-4xl text-blue-900 font-bold mt-2">
      {users.filter(u => u.role === "jobseeker").length}
    </h2>

    <p className="text-sm mt-1  opacity-80">
      Candidates
    </p>
       </div>

        <div className="bg-white  p-6 rounded-xl">
       <p className="text-sm text-blue-600 opacity-80">ADMINS</p>

       <h2 className="text-4xl text-blue-900 font-bold mt-2">
        {users.filter(u => u.role === "admin").length}
        </h2>

         <p className="text-sm mt-1  opacity-80">
          System managers
          </p>
         </div>

       </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto">

          <h2 className="text-2xl font-bold mb-4">All Users</h2>

          <div className="bg-blue-100 p-5 rounded-xl">

            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>JOINED</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="py-3">
                        {u.fname} {u.lname}
                      </td>

                      <td
                        className={
                          u.role === "jobseeker"
                            ? "text-blue-700"
                            : u.role === "employer"
                            ? "text-purple-700"
                            : "text-red-700"
                        }
                      >
                        {u.role}
                      </td>

                      <td>
                        {new Date(u.createdAt || "").toLocaleDateString()}
                      </td>

                      <td className="text-green-700">Active</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No users found</td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;