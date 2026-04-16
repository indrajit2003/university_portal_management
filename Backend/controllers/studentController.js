const User = require("../models/user");

// GET all students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, mobile, department } = req.body;

    if (!name || !email || !rollNumber || !mobile || !department) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    // check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists ❌" });
    }

    const student = new User({
      name,
      email,
      rollNumber,
      mobile,
      department,
      password: "123456",
      role: "student",
    });

    await student.save();

    res.json({ message: "Student added ✅" });

  } catch (err) {
    console.log(err); // 👈 IMPORTANT
    res.status(500).json({ message: "Server error ❌" });
  }
};