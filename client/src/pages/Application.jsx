/*
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Applications = () => {

  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  
  const { backendUrl, userData, userApplications, fetchUserData , fetchUserApplications } = useContext(AppContext);

  const updateResume = async () => {

    try {
      const formData = new FormData();

      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/update-resume",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    
    setIsEdit(false);
    setResume(null);
  }

  useEffect(() => {
    if (user) {
      fetchUserApplications()
    }
  },[user]);
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label className="flex items-center" htmlFor="reumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded mr-2">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="reumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="Please check !" />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-100 border border-gray-400 rounded-lg px-4 py-2 "
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                  href={userData.resume}
                  target='_blank'
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map((job, index) =>
              true ? (
                <tr key={index}>
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    <img className="w-8 h-8" src={job.companyId.image} />
                    {job.companyId.name}
                  </td>
                  <td className="py-2 px-4 border-b">{job.jobId.title}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.jobId.location}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        job.status === "Accepted"
                          ? "bg-green-200"
                          : job.status === "Rejected"
                          ? "bg-red-200"
                          : "bg-blue-200"
                      } px-4 py-1.5 rounded`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default Applications
*/


import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Local company logos
import googleLogo from "../assets/google.png";
import microsoftLogo from "../assets/microsoft_logo.png";
import adobeLogo from "../assets/adobe.png";
import amazonLogo from "../assets/amazon.png";
import defaultLogo from "../assets/default_company.png";

// Map company names to logos
const companyLogos = {
  Google: googleLogo,
  Microsoft: microsoftLogo,
  Adobe: adobeLogo,
  Amazon: amazonLogo,
};

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } =
    useContext(AppContext);

  const updateResume = async () => {
    if (!resume) return toast.error("Please select a resume first!");
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/users/update-resume",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setIsEdit(false);
    setResume(null);
  };

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        {/* Resume Section */}
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && !userData.resume) ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded mr-2">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="Upload Icon" className="h-6 w-6" />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-100 border border-gray-400 rounded-lg px-4 py-2"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href={userData.resume}
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Jobs Applied Section */}
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications && userApplications.length > 0 ? (
              userApplications.map((job, index) => {
                const companyName = job.companyId.name.trim();
                return (
                  <tr key={index}>
                    {/* Company Logo + Name */}
                    <td className="py-3 px-4 flex items-center gap-2 border-b">
                      <img
                        className="w-8 h-8 rounded-full border"
                        src={companyLogos[companyName] || job.companyId.image || defaultLogo}
                        alt={companyName}
                        onError={(e) => {
                          e.target.src = defaultLogo;
                        }}
                      />
                      {companyName}
                    </td>

                    {/* Job Title */}
                    <td className="py-2 px-4 border-b">{job.jobId.title}</td>

                    {/* Location */}
                    <td className="py-2 px-4 border-b max-sm:hidden">{job.jobId.location}</td>

                    {/* Date */}
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {moment(job.date).format("ll")}
                    </td>

                    {/* Status */}
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`${
                          job.status === "Accepted"
                            ? "bg-green-200"
                            : job.status === "Rejected"
                            ? "bg-red-200"
                            : "bg-blue-200"
                        } px-4 py-1.5 rounded`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
