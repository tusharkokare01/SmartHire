import express from "express";
import Resume from "../models/Resume.js";
import Application from "../models/Application.js";

const router = express.Router();

// Create or Update Resume
router.post("/", async (req, res) => {
  try {
    const { userId, resumeId, ...resumeData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Normalize name field to match schema
    if (resumeData.name && !resumeData.resumeName) {
      resumeData.resumeName = resumeData.name;
    }

    let savedResume;

    if (resumeId) {
      // Update by explicit resumeId
      savedResume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { userId, ...resumeData },
        { new: true, upsert: true }
      );
    } else {
      // Fallback: upsert based on (userId, resumeName) to avoid duplicates on double-save
      const query = {
        userId,
        ...(resumeData.resumeName ? { resumeName: resumeData.resumeName } : {}),
      };

      savedResume = await Resume.findOneAndUpdate(
        query,
        { userId, ...resumeData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json(savedResume);
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Resumes by User ID
router.get("/user/:userId", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Resumes (For HR - Only Applied Candidates)
router.get("/", async (req, res) => {
  try {
    // Get all distinct resumeIds from Applications
    const applications = await Application.find({}, "resumeId");
    const appliedResumeIds = applications.map((app) => app.resumeId);

    // Find resumes that match these IDs
    const resumes = await Resume.find({
      _id: { $in: appliedResumeIds },
    }).populate("userId", "name email");

    res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Single Resume by ID
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Resume by ID
router.delete("/:resumeId", async (req, res) => {
  try {
    const { resumeId } = req.params;

    const deleted = await Resume.findByIdAndDelete(resumeId);

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
