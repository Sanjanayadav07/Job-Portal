
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup storage for resumes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.pdf
  }
});

const upload = multer({ storage });

// Dummy auth middleware
const requireAuth = (req, res, next) => { next(); };

// GET all applications (dummy)
router.get("/applications", requireAuth, async (req, res) => {
  const applications = [
    { id: 1, name: "App 1", status: "pending" },
    { id: 2, name: "App 2", status: "approved" },
  ];
  res.json(applications);
});

// POST /api/applications/apply => upload resume
router.post("/applications/apply", requireAuth, upload.single("resume"), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Here, save the file info to DB if needed
    console.log("Resume uploaded:", file.filename);

    res.json({ message: "Resume uploaded successfully", fileName: file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

/*
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup storage for resumes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.pdf
  },
});

const upload = multer({ storage });

// Dummy auth middleware
const requireAuth = (req, res, next) => {
  next();
};

// ✅ GET all applications
router.get("/", requireAuth, async (req, res) => {
  const applications = [
    { id: 1, name: "App 1", status: "pending" },
    { id: 2, name: "App 2", status: "approved" },
  ];
  res.json(applications);
});

// ✅ GET single application by ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const application = { id, name: `App ${id}`, status: "pending" };
  res.json(application);
});

// ✅ POST /api/applications/apply => upload resume
router.post("/apply", requireAuth, upload.single("resume"), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    console.log("Resume uploaded:", file.filename);

    res.json({ message: "Resume uploaded successfully", fileName: file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
*/