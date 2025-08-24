import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } = useContext(AppContext);

  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) setJobData(data.job);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAlreadyApplied = () => {
    if (userApplications && jobData) {
      const hasApplied = userApplications.some(item => item.jobId._id === jobData._id);
      setIsAlreadyApplied(hasApplied);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    checkAlreadyApplied();
  }, [jobData, userApplications]);

  const applyHandler = async () => {
    try {
      if (!userData) return toast.error("Login to apply for job");

      // If user has no resume, require upload
      if (!userData.resume && !resumeFile) {
        return toast.error("Please upload a resume to apply");
      }

      const token = await getToken();

      // Upload resume if selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const uploadRes = await axios.put(`${backendUrl}/api/users/resume`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        if (!uploadRes.data.success) {
          return toast.error("Resume upload failed");
        } else {
          toast.success("Resume uploaded successfully");
        }
      }

      // Apply to job
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
        setIsAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loading />;

  if (!jobData) return <p className="text-center py-20">Job not found</p>;

  const needsResumeUpload = !userData?.resume;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">

            {/* Job Info */}
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={jobData.companyId.image || "/assets/placeholder.png"}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{jobData.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply / Upload Section */}
            <div className="flex flex-col justify-center text-end text-sm max-md:max-auto max-md:text-center w-full max-w-sm">
              {needsResumeUpload && (
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Upload Resume to Apply</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}

              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
                disabled={needsResumeUpload && !resumeFile || isAlreadyApplied}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
            </div>

            {/* More Jobs from Same Company */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {jobData.companyId.name}</h2>
              {jobs
                .filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                .filter(job => {
                  const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id));
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => <JobCard key={index} job={job} />)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;

