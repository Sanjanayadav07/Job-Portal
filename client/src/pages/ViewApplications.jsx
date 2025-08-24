/*
import React, { useContext, useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
//import placeholder from "../assets/user-placeholder.png";
import profileImg from "../assets/profile_img.png";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState(false);

  //const [applicants, setApplicants] = useState(false);

  // Function to fetch the company job applcation data

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });


      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Function to update the job application status

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);
  return applicants ? (
    applicants.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Applications Available</p>
      </div>
    ) : (
      <div className="container mx-auto p-4">
        <div>
          <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">User name</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left">Resume</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr key={index} className="text-gray-700">
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-center flex items-center">

                      <img
                        src={
                          applicant.userId?.image?.includes("placeholder.com")
                            ? profileImg
                            : applicant.userId?.image || profileImg
                        }
                        onError={(e) => { e.target.src = profileImg; }}
                        alt="user"
                        className="h-10 w-10 rounded-full border"
                      />

                      <span>{applicant.userId?.name || "Unknown User"}</span>

                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {applicant.jobId.title}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {applicant.jobId.location}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {applicant.resume ? (
                        <a
                          href={applicant.resume}
                          target="_blank"
                          className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                        >
                          Resume
                          <img src={assets.resume_download_icon} alt="Download Resume" />
                        </a>
                      ) : (
                        <span className="text-gray-400">No Resume</span>
                      )}
                    </td>

                    <td className="py-2 px-4 border-b relative">
                      {applicant.status === "pending" ? (
                        <div className="relative inline-block text-left group">
                          <button className="text-gray-500 action-button">
                            ...
                          </button>
                          <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Accepted"
                                )
                              }
                              className="block  w-full text-left  px-4 py-2 text-blue-500 hover:bg-gray-100 "
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Rejected"
                                )
                              }
                              className="block  w-full text-left  px-4 py-2 text-red-500 hover:bg-gray-100 "
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>{applicant.status}</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplications;

*/


import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import profileImg from "../assets/profile_img.png";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);

  // Fetch job applications for company
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/company/applicants",
        { headers: { token: companyToken } }
      );

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobApplications();
  }, [companyToken]);

  if (!applicants) return <Loading />;

  if (applicants.length === 0)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Applications Available</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">User name</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants
            .filter((item) => item.jobId && item.userId)
            .map((applicant, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center flex items-center gap-2">
                  <img
                    src={
                      applicant.userId?.image?.includes("placeholder.com")
                        ? profileImg
                        : applicant.userId?.image || profileImg
                    }
                    onError={(e) => { e.target.src = profileImg; }}
                    alt="user"
                    className="h-10 w-10 rounded-full border"
                  />
                  <span>{applicant.userId?.name || "Unknown User"}</span>
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.title}
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.location}
                </td>
                <td className="py-2 px-4 border-b">
                  {applicant.resume ? (
                    <a
                      //href={applicant.resume}
                      href={`http://localhost:5000${applicant.resume}`}
                      target="_blank"
                      className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                    >
                      Resume
                      <img src={assets.resume_download_icon} alt="Download Resume" />
                    </a>
                  ) : (
                    <span className="text-gray-400">No Resume</span>
                  )}
                </td>

                {/* Action: Only show Accept/Reject for recruiters */}
                {/* Action Column */}
                <td className="py-2 px-4 border-b relative">
                  {companyToken ? (
                    applicant.status === "pending" ? (
                      <div className="relative inline-block text-left group">
                        <button className="text-gray-500 action-button">...</button>
                        <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, "Accepted")
                            }
                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, "Rejected")
                            }
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`${applicant.status === "Accepted"
                          ? "text-green-600"
                          : applicant.status === "Rejected"
                            ? "text-red-600"
                            : "text-gray-500"
                          }`}
                      >
                        {applicant.status}
                      </span>
                    )
                  ) : (
                    // ✅ User view: by default Pending dikhega
                    <span
                      className={`${applicant.status === "Accepted"
                        ? "text-green-600"
                        : applicant.status === "Rejected"
                          ? "text-red-600"
                          : "text-gray-500"
                        }`}
                    >
                      {applicant.status || "Pending"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;

