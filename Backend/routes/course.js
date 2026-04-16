const express = require("express");
const router = express.Router();

const { protect, adminMiddleware } = require("../middleware/authmiddleware");
const Course = require("../models/course");

// 👉 ADD COURSE
router.post("/", protect, adminMiddleware, async (req, res) => {
  try {
    const { name, branch, year, type, professor } = req.body;

    if (!name || !branch || !year || !type || !professor) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    const course = new Course({
      name,
      branch,
      year,
      type,
      professor,
    });

    await course.save();

    res.json({ message: "Course Added ✅" });

  } catch (err) {
    console.log("ADD COURSE ERROR:", err);
    res.status(500).json({ message: err.message || "Error ❌" });
  }
});

// 👉 GET COURSES
router.get("/", protect, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

// 👉 DELETE COURSE
router.delete("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

module.exports = router;