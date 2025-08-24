import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const EditJob = () => {
  const { id } = useParams(); // Step 2a: Get job ID from URL
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Step 2b: Fetch job details
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setJob(data.job); // assuming API returns job object in data.job
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyToken) fetchJob();
  }, [companyToken]);

  // Step 2c: Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/jobs/${id}`,
        job, // send updated job object
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success("Job updated successfully");
        navigate("/dashboard/manage-jobs");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading />;
  if (!job) return <p className="text-center mt-10">Job not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Edit Job</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          value={job.title}
          onChange={(e) => setJob({ ...job, title: e.target.value })}
          placeholder="Job Title"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          value={job.location}
          onChange={(e) => setJob({ ...job, location: e.target.value })}
          placeholder="Location"
          className="border p-2 rounded"
          required
        />
        <textarea
          value={job.description}
          onChange={(e) => setJob({ ...job, description: e.target.value })}
          placeholder="Job Description"
          className="border p-2 rounded"
          rows={6}
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
