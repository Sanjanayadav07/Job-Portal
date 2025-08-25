/*
import express from "express"
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/user", getUserData);

router.post("/apply", applyForJob);

router.get("/applications", getUserJobApplications);

router.post("/update-resume", upload.single('resume'), updateUserResume);

export default router;
*/
import express from "express";
import { requireAuth, clerkClient } from "@clerk/express"; // ✅ include clerkClient here
import { getUserData, applyForJob, getUserJobApplications, updateUserResume, getUserDataById } from "../controllers/userController.js";
import User from "../models/User.js";
import multer from "multer";
import fs from "fs";
import path from "path";


//import { applyForJob } from "../controllers/userController.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ----- Multer setup -----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ----- Routes -----
//router.get("/:id", requireAuth(), getUserData);
router.get("/user/:id", requireAuth(), getUserData);
router.post("/apply", requireAuth(), applyForJob);
router.get("/applications", requireAuth(), getUserJobApplications);

// Resume upload route
router.put("/resume", requireAuth(), upload.single("resume"), updateUserResume);
 

router.get("/me", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
     
  
    let user = await getUserDataById(userId);
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.create({
       _id: userId,
        name: clerkUser.fullName 
               || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
               || "Unnamed User",
        email: clerkUser.emailAddresses[0].emailAddress,
        image: clerkUser.imageUrl?.includes("placeholder.com")
       ? "/assets/profile_img.png"
       : clerkUser.imageUrl || "/assets/profile_img.png",
       //resume: req.file ? `/uploads/${req.file.filename}` : null,
      });

    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

export default router;
