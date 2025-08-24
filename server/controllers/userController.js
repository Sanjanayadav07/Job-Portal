

import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary"; // fixed typo: clodinary → cloudinary

// Get user data
/*
export const getUserData = async (req, res) => {
  const { userId } = req.auth(); // Clerk userId

  try {
    const user = await User.findOne({ userId }); // ✅ use Clerk id, not Mongo ObjectId

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};*/
/*
export const getUserData = async (req, res) => {
  try {
    // If you’re using Clerk
    const { userId } = req.auth();  
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

*/
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth(); // get from Clerk
    console.log("Clerk userId:", userId);
    // const { id } = req.params; // get userId from URL
    const user = await User.findOne({ clerkId: userId });
    //const user = await User.findOne({ clerkId: id }); // if you store Clerk id
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Apply for job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const { userId } = req.auth();

  try {
    const user = await User.findById(userId);

    //const user = await User.findOne({ userId }); // ✅ fetch by Clerk ID
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.resume) return res.status(400).json({ success: false, message: "Resume not uploaded" });
    const isAlreadyApplied = await JobApplication.find({ jobId, userId: user._id });
    if (isAlreadyApplied.length > 0) {
      return res.json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId: user._id, // ✅ store Mongo ObjectId in applications
      jobId,
      resume: user.resume,
      date: Date.now(),
    });

    return res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get applied applications
/*
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const applications = await JobApplication.find({ userId: user._id })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications || applications.length === 0) {
      return res.json({ success: false, message: "No Job Applications Found for this user" });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};*/
/*
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const applications = await JobApplication.find({ userId }).populate("jobId companyId");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};*/

// userController.js
/*
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth();  // Clerk userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(400).json({ success: false, message: "Upload resume to apply" });
    }

    const applications = await JobApplication.find({ userId }).populate("jobId");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
*/
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk userId

    //if (!userId) {
     // return res.status(401).json({ success: false, message: "Unauthorized" });
    //}

    // Fetch applications and populate job and company references
    const applications = await Application.find({ userId })
      .populate("jobId")       // make sure jobId in schema is ref: "Job"
      .populate("companyId");  // make sure companyId in schema is ref: "Company"

    return res.json({ success: true, applications });
  } catch (err) {
    console.error("Error in getUserJobApplications:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




// Update user profile (resume)
/*
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resumeFile = req.file;

    //const userData = await User.findOne({ userId }); // ✅ Clerk id
     const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();

    return res.json({ success: true, message: "Resume updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
*/

// Update user's resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const resumePath = req.file.path;
    const user = await User.findByIdAndUpdate(
      userId,
      { resume: resumePath },
      { new: true }
    );

    res.json({ success: true, message: "Resume uploaded successfully", user });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



/*
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth();  // Clerk userId
    const resumeFile = req.file;    // from multer

    const userData = await User.findById(userId); // ✅ correct query

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (resumeFile) {
      const resumeUpload = await cloudinary.v2.uploader.upload(resumeFile.path, {
        resource_type: "auto", // handles pdf/docx
      });
      userData.resume = resumeUpload.secure_url;
    } else {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    await userData.save();

    return res.json({ success: true, message: "Resume updated", resume: userData.resume });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
*/

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserDataById = async (userId) => {
  return await User.findById(userId); // returns null if not found
};