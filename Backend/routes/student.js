const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// 👉 ADD STUDENT
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, rollNumber, mobile, department } = req.body;

    if (!name || !email || !rollNumber || !mobile || !department) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const student = new User({
      name,
      email,
      rollNumber,
      mobile,
      department,
      password: hashedPassword,
      role: "student",
    });

    await student.save();

    res.json({ message: "Student Added ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// 👉 GET STUDENTS
router.get("/", protect, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error ❌" });
  }
});

// 👉 DELETE STUDENT 🔥
router.delete("/:id", protect, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    res.json({ message: "Student Deleted ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error ❌" });
  }
});

module.exports = router;