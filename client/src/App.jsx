import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import ApplyJob from "./pages/Applyjob";
//import ApplyJob from "./pages/ApplyJob";
import EditJob from "./pages/EditJob";
import Home from "./pages/Home";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import ViewApplications from "./pages/ViewApplications";
import ManageJobs from "./pages/ManageJobs";
import AddJob from "./pages/AddJob";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
     

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<ViewApplications />} />

        <Route path="/dashboard" element={companyToken ? <Dashboard /> : <Home />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
           <Route path="*" element={<ManageJobs />} /> {/* Redirect unknown paths */}
          <Route path="/dashboard/edit-job/:id" element={<EditJob />} />
        </Route>
      </Routes>
      

    </div>
  );
};

export default App;

