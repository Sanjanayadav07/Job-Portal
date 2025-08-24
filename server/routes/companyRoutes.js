import express from "express";
import {
  changeJobApplicationStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js"; // ✅ correct


const router = express.Router();

router.post("/register",upload.single('image'), registerCompany);
router.post("/login", loginCompany);
router.get("/company", protectCompany ,getCompanyData);
router.post("/post-job",protectCompany, postJob);
router.get("/applicants",protectCompany, getCompanyJobApplicants);
router.get("/list-jobs",protectCompany, getCompanyPostedJobs);
router.post("/change-status",protectCompany, changeJobApplicationStatus);
router.post("/change-visibility",protectCompany, changeVisibility);

export default router;