/*
import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState(false);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobsData.reverse());
        console.log(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // function to chnage the visibility

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id},
        {
          headers: { token: companyToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs()
      }
      else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);
  return jobs ? jobs.length === 0 ? (
    <div className="flex items-center justify-center h-[70vh]">
    <p className="text-xl sm:text-2xl">No jobs posted or available</p>
    </div>
  ) : (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden ">#</th>
              <th className="py-2 px-4 border-b text-left ">Job Title</th>
              <th className="py-2 px-4 border-b text-left  max-sm:hidden  ">
                Date
              </th>
              <th className="py-2 px-4 border-b text-left  max-sm:hidden ">
                Location
              </th>
              <th className="py-2 px-4 border-b text-center ">Applicants</th>
              <th className="py-2 px-4 border-b text-left ">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b">{job.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {moment(job.date).format("ll")}
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {job.location}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {job.applicants}
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    onChange={() => changeJobVisibility(job._id)}
                    className="scale-125 ml-4"
                    type="checkbox"
                    checked={job.visible}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-black text-white py-2 px-4 rounded"
        >
          Add New Job
        </button>
      </div>
    </div>
  ) : <Loading/>
};

export default ManageJobs;

*/


import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobsData.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  if (!jobs) return <Loading />;

  if (jobs.length === 0)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No jobs posted or available</p>
      </div>
    );

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 border-b text-center">Applicants</th>
              <th className="py-2 px-4 border-b text-left">Visible</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={job._id} className="text-gray-700">
                <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                <td className="py-2 px-4 border-b">{job.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format("ll")}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                <td className="py-2 px-4 border-b text-center">{job.applicants}</td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    className="scale-125 ml-4"
                    checked={job.visible}
                    onChange={() => changeJobVisibility(job._id)}
                  />
                </td>
                <td className="py-2 px-4 border-b gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-job/${job._id}`)}
                    //className="bg-blue-500 text-white px-2 py-1 rounded"
                     className="w-20 bg-blue-500 text-white py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this job?")) return;
                      try {
                        const { data } = await axios.delete(
                          `${backendUrl}/api/jobs/${job._id}`,
                          { headers: { token: companyToken } }
                        );
                        if (data.success) {
                          toast.success("Job deleted successfully");
                          fetchCompanyJobs();
                        } else toast.error(data.message);
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }}
                    //className="bg-red-500 text-white px-2 py-1 rounded"
                    className="w-20 bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-black text-white py-2 px-4 rounded"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;


