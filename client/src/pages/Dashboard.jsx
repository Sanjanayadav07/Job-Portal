import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext);

  // Logout function
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  // Redirect logic
  useEffect(() => {
    if (!companyData) {
      navigate("/");
    } else if (window.location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData, navigate]);

  // Helper for NavLink class
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
      isActive ? "bg-blue-100 border-r-4 border-blue-500" : ""
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="shadow py-4">
        <div className="px-5 flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="max-sm:w-32 cursor-pointer"
            src={assets.logo}
            alt="Logo"
          />
          {companyData && (
            <div className="flex items-center gap-3 relative">
              <p className="max-sm:hidden">Welcome, {companyData.name}</p>
              <div className="relative group">
                <img
                  className="w-8 border rounded-full cursor-pointer"
                  src={companyData.image}
                  alt="Company Icon"
                />
                <div className="absolute hidden group-hover:block top-full right-0 mt-2 z-10 text-black rounded-md">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md">
                    <li
                      onClick={logout}
                      className="py-1 px-2 cursor-pointer hover:bg-gray-100"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-1 items-start">
        {/* Sidebar */}
        <div className="flex flex-col h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink className={navLinkClass} to="/dashboard/add-job">
              <img className="min-w-[1rem]" src={assets.add_icon} alt="Add Job" />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>
            <NavLink className={navLinkClass} to="/dashboard/manage-jobs">
              <img className="min-w-[1rem]" src={assets.home_icon} alt="Manage Jobs" />
              <p className="max-sm:hidden">Manage Jobs</p>
            </NavLink>
            <NavLink className={navLinkClass} to="/dashboard/view-applications">
              <img
                className="min-w-[1rem]"
                src={assets.person_tick_icon}
                alt="View Applications"
              />
              <p className="max-sm:hidden">View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 h-full p-2 sm:p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;