import express from "express";
import { getJobById, getJobs , updateJob, deleteJob} from "../controllers/jobController.js";

const router = express.Router();

// Route to get all jobs

router.get("/", getJobs);

// Route to get jobs by id

router.get("/:id", getJobById);

// **Update job by id**
router.put("/:id", updateJob);

// **Delete job by id**
router.delete("/:id", deleteJob);

export default router;