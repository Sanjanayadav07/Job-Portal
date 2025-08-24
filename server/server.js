
import mongoose from "mongoose";

import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js"
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import {clerkMiddleware} from "@clerk/express"
import { fileURLToPath } from "url";
import path from "path";

import applicationRoutes from "./routes/applications.js";
import JobApplication from "./models/JobApplication.js";

import { protectCompany } from "./middlewares/authMiddleware.js";




// Initialize the app
const app = express();

// Connecting to DB
await connectDB();

// connect to clodinary

 await connectCloudinary();
 
// Middlewares
//app.use(cors());
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://job-portal-1-nq2z.onrender.com" // Production frontend
  ],
 // match your current frontend origin
  credentials: true,               // if you need cookies/auth
}));

app.use(express.json());
app.use(clerkMiddleware());

// Routes
// Routes
app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My First Sentry Error");
});

// Paste your /applications route here
app.get("/applications", protectCompany, async (req, res) => {
  try {
    console.log("Fetching applications for company:", req.company._id);

    const existing = await JobApplication.find({ companyId: req.company._id });

    if (existing.length === 0) {
      await JobApplication.create({
        userId: mongoose.Types.ObjectId("USER_ID_HERE"),
        companyId: req.company._id,
        jobId: mongoose.Types.ObjectId("JOB_ID_HERE"),
        status: "pending",
        date: Date.now(),
      });
      console.log("Inserted dummy application for testing.");
    }

    const applications = await JobApplication.find({ companyId: req.company._id });
    if (applications.length === 0) {
      return res.json({ success: true, message: "No Applications Available", applications: [] });
    }

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post("/webhooks", clerkWebhooks);

//API
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api", applicationRoutes);

//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "server/uploads")));

// ✅ React build serve karna (production only)
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Port Set up
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Handle unhandled promise rejections and exceptions
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});


app.use("/api", applicationRoutes);