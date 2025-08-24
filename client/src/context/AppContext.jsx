import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  const { user } = useUser();
  const { getToken } = useAuth();

  // ================= States =================
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplication] = useState([]);

  // ================= Fetch Jobs =================
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= Fetch Company Data =================
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });
      if (data.success) setCompanyData(data.company);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= Fetch User Data =================
  const fetchUserData = async () => {
    try {
      if (!user?.id) return;

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setUserData(data.user);
      else toast.error(data.message);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to fetch user data");
    }
  };

  // ================= Fetch User Applications =================
  const fetchUserApplications = async () => {
    try {
      if (!user?.id) return;

      const token = await getToken(); // Clerk token

      const { data } = await axios.get(`${backendUrl}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserApplication(data.applications);
        console.log("User applications:", data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching applications:", err.response?.data || err.message);
      toast.error("Failed to fetch applications");
    }
  };

  // ================= Effects =================
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) setCompanyToken(storedCompanyToken);
  }, []);

  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  // ================= Context Value =================
  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplication,
    fetchUserData,
    fetchUserApplications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
