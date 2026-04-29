import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import JobseekerDashboard from "./Pages/JobseekerDashboard";
import EmployerDashboard from "./Pages/EmployerDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import PostJob from "./Pages/PostJob";
import JobseekerJobList from "./Pages/JobseekerJobList";
import EmployerJobList from "./Pages/EmployerJobList";
import ApplyModal from "./Pages/ApplyModal";
import EmployerApplications from "./Pages/EmpolyerApplications";
import JobSeekerApplications from "./Pages/JobseekerApplications";
import AdminJobList from "./Pages/AdminJobList";
import Notifications from "./Pages/Notifications";
import Interview from "./Pages/Interview"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobseekerdashboard" element={<JobseekerDashboard />} />
        <Route path="/employerdashboard" element={<EmployerDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* ✅ FIXED */}
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/jobseekerjoblist" element={<JobseekerJobList />} />
        <Route path="/employerjoblist" element={<EmployerJobList />} />
        <Route path="/apply" element={<ApplyModal job={undefined} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/applications" element={<EmployerApplications />} />
        <Route path="/my-applications" element={<JobSeekerApplications />} />
        <Route path="/adminjoblist" element= { <AdminJobList />} />
        <Route path="/notifications" element={ <Notifications />} />
        <Route path="/interview/:id" element={<Interview />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;